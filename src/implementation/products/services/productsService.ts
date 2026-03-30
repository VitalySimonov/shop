import { apiClient } from '../../auth/apiClient';
import type { IProduct } from '../../../types/Product';
import type { IProductsResponse } from '../../../types/ProductsResponse';
import { filterProducts, hasAdvancedFilters, sortProducts } from '../productFilters';
import type { IProductsService } from '../interfaces/productsService.interface';
import type { IProductsQueryParams } from '../types/productsQueryParams';

function mapSortFieldToApi(field: string): string {
  if (field === 'article' || field === 'rating') {
    return 'id';
  }
  return field;
}

async function fetchAllProducts(): Promise<IProduct[]> {
  const res = await apiClient<IProductsResponse>(`/products?limit=0&skip=0`, { auth: true });
  return res.products;
}

function categoryToLabel(category: string): string {
  return category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export const productsService: IProductsService = {
  async getProducts(params: IProductsQueryParams) {
    if (hasAdvancedFilters(params)) {
      const all = await fetchAllProducts();
      let list = filterProducts(all, params);
      list = sortProducts(list, params.sortBy, params.order ?? 'asc');
      const total = list.length;
      const skip = (params.page - 1) * params.limit;
      const products = list.slice(skip, skip + params.limit);
      return {
        products,
        total,
        skip,
        limit: params.limit,
      };
    }

    const skip = (params.page - 1) * params.limit;
    const query = new URLSearchParams({
      limit: String(params.limit),
      skip: String(skip),
    });

    const apiSort = params.sortBy ? mapSortFieldToApi(params.sortBy) : undefined;
    if (apiSort) {
      query.set('sortBy', apiSort);
    }
    if (params.order) {
      query.set('order', params.order);
    }
    if (params.search) {
      query.set('q', params.search);
      return apiClient<IProductsResponse>(`/products/search?${query.toString()}`, { auth: true });
    }

    return apiClient<IProductsResponse>(`/products?${query.toString()}`, { auth: true });
  },

  async createProduct(payload) {
    return apiClient<IProduct>('/products/add', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  async getProductCategories() {
    const categories = await apiClient<string[]>(`/products/category-list`, { auth: true });
    return categories.map((category) => ({ category, name: categoryToLabel(category) }));
  },
} satisfies IProductsService;

export const getProducts = productsService.getProducts.bind(productsService);
export const createProduct = productsService.createProduct.bind(productsService);
export const getProductCategories = productsService.getProductCategories.bind(productsService);
