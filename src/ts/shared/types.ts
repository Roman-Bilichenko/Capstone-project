export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
}