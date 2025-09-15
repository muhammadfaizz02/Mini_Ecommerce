export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}