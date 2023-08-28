export interface Cart {
  CartItems?: CartItem[];
  PersonId?: any;
  currenciesGateway?: any;
  totalPrice?: number;
  id?: number;
  BusinessId?: number;
  market?: string;
  createdAt?: string;
  status?: boolean;
  Business?: IBusiness;
  hasShippingBusiness?: boolean;
  offerGiftDiscount?: any;
}

export interface IBusiness {
  name?: string;
  logo?: string;
  cellphone?: string;
  email?: string;
  address?: string;
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
  quantityCurrent?: number;
  offerValue?: number;
  isPercent?: boolean;
  id?: number;
  createdAt?: any;
  updatedAt?: any;
  deletedAt?: any;
  sharedImage?: any;
  name?: any;
  offerGiftDiscount?: any;
  totalPrice?: number;
}
