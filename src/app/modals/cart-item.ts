export interface Cart {
  CartItems?: CartItem[];
  PersonId?: any;
  totalPrice?: number;
  id?: number;
  BusinessId?: number;
  Business?: {
    name?: string;
    logo?: string;
    cellphone?: string;
    email?: string;
  };
}

export interface CartItem {
  Product?: any;
  ProductId?: any;
  quantity?: number;
  id?: number;
  createdAt?: any;
  updatedAt?: any;
  deletedAt?: any;
}
