import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseOptNumber } from '../../../utilits/productsPageUtils';

const PAGE_SIZE = 20;

export function useProductsUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1') || 1;
  const limit = PAGE_SIZE;
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? '';
  const orderParam = searchParams.get('order');
  const order: 'asc' | 'desc' | undefined =
    orderParam === 'asc' || orderParam === 'desc' ? orderParam : undefined;

  const filterTitle = searchParams.get('filterTitle') ?? '';
  const filterArticle = searchParams.get('filterArticle') ?? '';
  const priceMin = parseOptNumber('priceMin', searchParams);
  const priceMax = parseOptNumber('priceMax', searchParams);
  const ratingMin = parseOptNumber('ratingMin', searchParams);
  const ratingMax = parseOptNumber('ratingMax', searchParams);

  const vendorsParam = searchParams.get('vendors') ?? '';
  const vendorItems = useMemo(
    () =>
      vendorsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [vendorsParam],
  );

  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  const updateParams = useCallback(
    (patch: Record<string, string | number | undefined | null>) => {
      const next = new URLSearchParams(searchParams);
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === null || v === '') {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return {
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
  };
}
