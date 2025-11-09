export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  images: string[];
  sizes?: string[];
}
