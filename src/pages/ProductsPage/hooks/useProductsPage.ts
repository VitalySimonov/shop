import { useMemo, useState } from 'react';
import type { GridPaginationModel, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { useProductCreate } from './useProductCreate';
import { useProductsFilters } from './useProductsFilters';
import { useProductsList } from './useProductsList';
import { useProductsUrlState } from './useProductsUrlState';
import { buildPageList } from '../../../utilits/productsPageUtils';

export function useProductsPage() {
  const {
    page,
    limit,
    search,
    sortBy,
    order,
    filterTitle,
    filterArticle,
    priceMin,
    priceMax,
    ratingMin,
    ratingMax,
    vendorItems,
    searchDraft,
    setSearchDraft,
    updateParams,
  } = useProductsUrlState();

  const { rows, rowCount, loading, error, handleRefresh } = useProductsList({
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
  });

  const filters = useProductsFilters({
    filterTitle,
    filterArticle,
    vendorItems,
    priceMin,
    priceMax,
    ratingMin,
    ratingMax,
    sortBy,
    updateParams,
  });

  const productCreate = useProductCreate(updateParams);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const paginationModel: GridPaginationModel = useMemo(
    () => ({ page: page - 1, pageSize: limit }),
    [page, limit],
  );

  const sortModel: GridSortModel = useMemo(() => {
    if (!sortBy) {
      return [];
    }
    const sortDir: 'asc' | 'desc' = order ?? 'asc';
    return [{ field: sortBy, sort: sortDir }];
  }, [sortBy, order]);

  const totalPages = Math.max(1, Math.ceil(rowCount / limit));
  const pageNumbers = useMemo(() => buildPageList(page, totalPages, 5), [page, totalPages]);

  const from = rowCount === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, rowCount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchDraft.trim() || null, page: 1 });
  };

  return {
    searchDraft,
    setSearchDraft,
    updateParams,
    rows,
    rowCount,
    loading,
    error,
    handleRefresh,
    rowSelectionModel,
    setRowSelectionModel,
    paginationModel,
    sortModel,
    page,
    limit,
    totalPages,
    pageNumbers,
    from,
    to,
    sortBy,
    order,
    filterTitle,
    filterArticle,
    vendorItems,
    handleSearchSubmit,
    ...filters,
    ...productCreate,
  };
}
