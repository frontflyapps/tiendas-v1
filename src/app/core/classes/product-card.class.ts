export interface IProductCard {
  id: number;
  name: {
    es: string,
    en: string
  };
  Stock: {
    id: number,
  };
  Images: Array<{ image: string }>; // take 1 element
  Category: {
    name: string
  };
  rating: number;
  offerValue: number;
  minSale: number;
  type: string;
}
