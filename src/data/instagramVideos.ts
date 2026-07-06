/**
 * EDITABLE: Instagram video card placeholders.
 * PLACEHOLDER thumbnails — replace with real reel/post URLs when available.
 */

export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/kobboplay?igsh=MXE3bDZ3NWxzbzk0bg%3D%3D&utm_source=qr";

export interface InstagramVideo {
  id: string;
  title: string;
  thumbnail: string;
  /** PLACEHOLDER: Link to specific reel/post when available */
  instagramUrl: string;
}

export const instagramVideos: InstagramVideo[] = [
  {
    id: "1",
    title: "Building Blocks Unboxing",
    thumbnail:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=500&fit=crop",
    instagramUrl: INSTAGRAM_PROFILE_URL,
  },
  {
    id: "2",
    title: "Stacking Rings Demo",
    thumbnail:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop",
    instagramUrl: INSTAGRAM_PROFILE_URL,
  },
  {
    id: "3",
    title: "Busy Board Playtime",
    thumbnail:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=500&fit=crop",
    instagramUrl: INSTAGRAM_PROFILE_URL,
  },
  {
    id: "4",
    title: "Pull Along Fun",
    thumbnail:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=500&fit=crop",
    instagramUrl: INSTAGRAM_PROFILE_URL,
  },
];
