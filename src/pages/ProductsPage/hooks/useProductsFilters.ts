import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getProductCategories,
  type IProductCategoryOption,
} from '../../../implementation/products/productsApi';

type IUpdateParams = (patch: Record<string, string | number | undefined | null>) => void;

interface IUseProductsFiltersArgs {
  filterTitle: string;
  filterArticle: string;
  vendorItems: string[];
  priceMin: number | undefined;
  priceMax: number | undefined;
  ratingMin: number | undefined;
  ratingMax: number | undefined;
  sortBy: string;
  updateParams: IUpdateParams;
}

export function useProductsFilters({
  filterTitle,
  filterArticle,
  vendorItems,
  priceMin,
  priceMax,
  ratingMin,
  ratingMax,
  sortBy,
  updateParams,
}: IUseProductsFiltersArgs) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilterTitle, setDraftFilterTitle] = useState('');
  const [draftFilterArticle, setDraftFilterArticle] = useState('');
  const [draftVendors, setDraftVendors] = useState<string[]>([]);
  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [draftRatingMin, setDraftRatingMin] = useState('');
  const [draftRatingMax, setDraftRatingMax] = useState('');
  const [filterApplyError, setFilterApplyError] = useState<string | null>(null);

  const openFiltersDialog = useCallback(() => {
    setFilterApplyError(null);
    setDraftFilterTitle(filterTitle);
    setDraftFilterArticle(filterArticle);
    setDraftVendors([...vendorItems]);
    setDraftPriceMin(priceMin != null ? String(priceMin) : '');
    setDraftPriceMax(priceMax != null ? String(priceMax) : '');
    setDraftRatingMin(ratingMin != null ? String(ratingMin) : '');
    setDraftRatingMax(ratingMax != null ? String(ratingMax) : '');
    setFilterOpen(true);
  }, [filterTitle, filterArticle, vendorItems, priceMin, priceMax, ratingMin, ratingMax]);

  const categoriesQuery = useQuery({
    queryKey: ['productCategories'],
    queryFn: () => getProductCategories(),
    enabled: filterOpen,
    retry: false,
    staleTime: 5 * 60_000,
    select: (data) => [...data].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
  });

  const applyFiltersFromDraft = useCallback(() => {
    const parseNum = (s: string) => {
      const t = s.trim();
      if (t === '') {
        return null;
      }
      const n = Number(t.replace(',', '.'));
      return Number.isFinite(n) ? String(n) : null;
    };
    const parseFinite = (s: string): number | null => {
      const t = s.trim();
      if (t === '') {
        return null;
      }
      const n = Number(t.replace(',', '.'));
      return Number.isFinite(n) ? n : null;
    };
    const pMin = parseFinite(draftPriceMin);
    const pMax = parseFinite(draftPriceMax);
    const rMin = parseFinite(draftRatingMin);
    const rMax = parseFinite(draftRatingMax);
    if (pMin != null && pMax != null && pMin > pMax) {
      setFilterApplyError(
        'Укажите корректный диапазон цены: значение «от» не должно быть больше «до».',
      );
      return;
    }
    if (rMin != null && rMax != null && rMin > rMax) {
      setFilterApplyError(
        'Укажите корректный диапазон оценки: значение «от» не должно быть больше «до».',
      );
      return;
    }
    if (rMin != null && (rMin < 0 || rMin > 5)) {
      setFilterApplyError('Оценка «от» должна быть в диапазоне от 0 до 5.');
      return;
    }
    if (rMax != null && (rMax < 0 || rMax > 5)) {
      setFilterApplyError('Оценка «до» должна быть в диапазоне от 0 до 5.');
      return;
    }
    setFilterApplyError(null);
    updateParams({
      filterTitle: draftFilterTitle.trim() || null,
      filterArticle: draftFilterArticle.trim() || null,
      vendors: draftVendors.length > 0 ? draftVendors.join(',') : null,
      priceMin: parseNum(draftPriceMin),
      priceMax: parseNum(draftPriceMax),
      ratingMin: parseNum(draftRatingMin),
      ratingMax: parseNum(draftRatingMax),
      page: 1,
    });
    setFilterOpen(false);
  }, [
    draftFilterTitle,
    draftFilterArticle,
    draftVendors,
    draftPriceMin,
    draftPriceMax,
    draftRatingMin,
    draftRatingMax,
    updateParams,
  ]);

  const clearFiltersAndSort = useCallback(() => {
    updateParams({
      filterTitle: null,
      filterArticle: null,
      priceMin: null,
      priceMax: null,
      ratingMin: null,
      ratingMax: null,
      vendors: null,
      sortBy: null,
      order: null,
      page: 1,
    });
  }, [updateParams]);

  const hasFiltersOrSort = useMemo(
    () =>
      !!sortBy ||
      !!filterTitle.trim() ||
      !!filterArticle.trim() ||
      vendorItems.length > 0 ||
      priceMin != null ||
      priceMax != null ||
      ratingMin != null ||
      ratingMax != null,
    [
      sortBy,
      filterTitle,
      filterArticle,
      vendorItems.length,
      priceMin,
      priceMax,
      ratingMin,
      ratingMax,
    ],
  );

  return {
    filterOpen,
    setFilterOpen,
    filterApplyError,
    setFilterApplyError,
    draftFilterTitle,
    setDraftFilterTitle,
    draftFilterArticle,
    setDraftFilterArticle,
    categories: categoriesQuery.data ?? ([] as IProductCategoryOption[]),
    categoriesLoading: categoriesQuery.isPending || categoriesQuery.isFetching,
    draftVendors,
    setDraftVendors,
    draftPriceMin,
    setDraftPriceMin,
    draftPriceMax,
    setDraftPriceMax,
    draftRatingMin,
    setDraftRatingMin,
    draftRatingMax,
    setDraftRatingMax,
    openFiltersDialog,
    applyFiltersFromDraft,
    clearFiltersAndSort,
    hasFiltersOrSort,
  };
}
