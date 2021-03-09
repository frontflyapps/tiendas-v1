export interface Cart {
  CartItems?: CartItem[];
  PersonId?: any;
  totalPrice?: number;
  id?: number;
  BusinessId?: number;
  market?: string;
  Business?: {
    name?: string;
    logo?: string;
    cellphone?: string;
    email?: string;
  };
}

export interface Stock {
  id?: number;
  quantity?: number;
  quantityRecord?: number;
  quantityThreshold?: number;
  showStockQuantity?: boolean;
  costWeighted?: number;
  allowBackOrders?: boolean;
}

export interface CartItem {
  Product?: any;
  ProductId?: any;
  StockId?: number;
  Stock?: Stock;
  quantity?: number;
  id?: number;
  createdAt?: any;
  updatedAt?: any;
  deletedAt?: any;
}
