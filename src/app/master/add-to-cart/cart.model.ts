export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}
export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  feature: string;
  variantType: string;
  variantSize: string;
  quantity: number;
  slug:string;
  updatedprice:number;
}
