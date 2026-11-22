import { NextResponse } from "next/server";
import { getReviewImage } from "@/lib/reviews-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const media = getReviewImage(id);
  if (!media) {
    return new NextResponse("Image not found", { status: 404 });
  }

  return new NextResponse(media.buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
