export interface ICreateProductPayload {
  title: string;
  category: string;
  price: number;
  stock: number;
  /** Артикул / SKU (DummyJSON принимает в теле add) */
  sku?: string;
}
