import fs from "fs";
import path from "path";

interface StoredMedia {
  buffer: Buffer;
  contentType: string;
}

// Global in-memory cache to ensure images can be served even on serverless or before disk sync
const memoryCache = new Map<string, StoredMedia>();

function getUploadsDir(): string {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "reviews");
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (error) {
    // If filesystem is read-only (e.g. serverless environment), memory cache will be used
    console.warn("Could not create uploads directory, using memory store:", error);
  }
  return uploadsDir;
}

/**
 * Saves an image (Buffer or Base64 data URL) and returns the public serving path or URL.
 */
export async function saveReviewImage(
  dataUriOrBuffer: string | Buffer,
  mimeType = "image/jpeg",
): Promise<string> {
  const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  let buffer: Buffer;
  let detectedMime = mimeType;

  if (typeof dataUriOrBuffer === "string") {
    // Parse base64 data URL: data:image/jpeg;base64,...
    const match = dataUriOrBuffer.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      detectedMime = match[1];
      buffer = Buffer.from(match[2], "base64");
    } else {
      buffer = Buffer.from(dataUriOrBuffer, "base64");
    }
  } else {
    buffer = dataUriOrBuffer;
  }

  // Determine file extension
  const ext = detectedMime.includes("png")
    ? "png"
    : detectedMime.includes("webp")
      ? "webp"
      : "jpg";
  const filename = `${id}.${ext}`;

  // Store in memory cache
  memoryCache.set(filename, { buffer, contentType: detectedMime });

  // Attempt to write to public/uploads/reviews for static file serving
  try {
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
  } catch {
    // Memory cache will serve the file via API route fallback
  }

  // Return absolute or relative public URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://kobbo.in");

  return `${baseUrl}/api/reviews/media/${filename}`;
}

/**
 * Retrieves a stored review image by filename.
 */
export function getReviewImage(filename: string): StoredMedia | null {
  // Check memory cache first
  const cached = memoryCache.get(filename);
  if (cached) return cached;

  // Try reading from disk
  try {
    const filePath = path.join(process.cwd(), "public", "uploads", "reviews", filename);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      const contentType =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";
      return { buffer, contentType };
    }
  } catch {
    // Ignore error
  }

  return null;
}
