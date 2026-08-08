export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Sreepriya D.",
    rating: 5,
    text: "My son didn't even realize he was learning while playing. That's exactly what I was looking for.",
  },
  {
    id: "2",
    name: "Krunal M.",
    rating: 5,
    text: "Such a fun activity to do together, it kept my little one happily engaged for a long time.",
  },
  {
    id: "3",
    name: "Neha R.",
    rating: 4,
    text: "Delivery took a day longer than expected but the toy quality made up for it.",
  },
];
