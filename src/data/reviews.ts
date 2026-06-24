export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Priya M.",
    rating: 5,
    text: "Beautiful quality toys! My daughter loves the stacking rings. Fast delivery too.",
  },
  {
    id: "2",
    name: "Rahul K.",
    rating: 5,
    text: "Finally found a store with thoughtful, skill-building toys. The busy board is a hit!",
  },
  {
    id: "3",
    name: "Ananya S.",
    rating: 5,
    text: "Premium packaging and great selection. Already ordered again for a birthday gift.",
  },
];
