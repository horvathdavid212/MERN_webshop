export interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  description: string;
  countInStock: number;
  rating: number; //0-5
  reviewCount: number;
  ratings: IRating[];
}

export interface IRating {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
}
