import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '../../../implementation/products/productsApi';

interface IUseProductsListParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  order: 'asc' | 'desc' | undefined;
  filterTitle: string;
  filterArticle: string;
  vendorItems: string[];
  priceMin: number | undefined;
  priceMax: number | undefined;
  ratingMin: number | undefined;
  ratingMax: number | undefined;
}

export function useProductsList(params: IUseProductsListParams) {
  const {
    page,
    limit,
    search,
    sortBy,
    order,
    filterTitle,
    filterArticle,
    vendorItems,
    priceMin,
    priceMax,
    ratingMin,
    ratingMax,
  } = params;

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      sortBy: sortBy || undefined,
      order: sortBy ? (order ?? 'asc') : undefined,
      filterTitle: filterTitle.trim() || undefined,
      filterArticle: filterArticle.trim() || undefined,
      vendorItems: vendorItems.length > 0 ? vendorItems : undefined,
      priceMin,
      priceMax,
      ratingMin,
      ratingMax,
    }),
    [
      page,
      limit,
      search,
      sortBy,
      order,
      filterTitle,
      filterArticle,
      vendorItems,
      priceMin,
      priceMax,
      ratingMin,
      ratingMax,
    ],
  );

  const queryClient = useQueryClient();

  const { data, isFetching, error: queryError } = useQuery({
    queryKey: ['products', queryArgs],
    queryFn: () => getProducts(queryArgs),
  });

  const handleRefresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  return {
    rows: data?.products ?? [],
    rowCount: data?.total ?? 0,
    loading: isFetching,
    error: queryError ? 'Не удалось загрузить товары' : null,
    handleRefresh,
  };
}
