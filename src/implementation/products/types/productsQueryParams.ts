import type { IProductFilterParams } from './productFilterParams';

export interface IProductsQueryParams extends IProductFilterParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
