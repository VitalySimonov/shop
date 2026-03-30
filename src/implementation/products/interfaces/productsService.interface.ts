import type { IProduct } from '../../../types/Product';
import type { IProductsResponse } from '../../../types/ProductsResponse';
import type { ICreateProductPayload } from '../types/createProductPayload';
import type { IProductCategoryOption } from '../types/productCategoryOption';
import type { IProductsQueryParams } from '../types/productsQueryParams';

export interface IProductsService {
  getProducts(params: IProductsQueryParams): Promise<IProductsResponse>;
  createProduct(payload: ICreateProductPayload): Promise<IProduct>;
  getProductCategories(): Promise<IProductCategoryOption[]>;
}
