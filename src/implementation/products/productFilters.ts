import type { IProduct } from '../../types/Product';
import type { IProductFilterParams } from './types/productFilterParams';

export type { IProductFilterParams } from './types/productFilterParams';

export function articleFromId(id: number): string {
  const base = id.toString(36).toUpperCase().slice(0, 6).padEnd(6, '0');
  return `${base.slice(0, 4)}-${base.slice(4, 6)}`;
}

export function ratingFromId(id: number): number {
  const r = 3 + ((id * 17) % 23) / 10;
  return Math.min(5, Math.round(r * 10) / 10);
}

export function hasAdvancedFilters(p: IProductFilterParams): boolean {
  return !!(
    p.filterTitle?.trim() ||
    p.filterArticle?.trim() ||
    (p.vendorItems && p.vendorItems.length > 0) ||
    p.priceMin != null ||
    p.priceMax != null ||
    p.ratingMin != null ||
    p.ratingMax != null
  );
}

export function filterProducts(products: IProduct[], p: IProductFilterParams): IProduct[] {
  let list = [...products];

  const globalQ = p.search?.trim().toLowerCase();
  if (globalQ) {
    list = list.filter((x) => x.title.toLowerCase().includes(globalQ));
  }

  const ft = p.filterTitle?.trim().toLowerCase();
  if (ft) {
    list = list.filter((x) => x.title.toLowerCase().includes(ft));
  }

  const fa = p.filterArticle?.trim().toLowerCase();
  if (fa) {
    list = list.filter((x) => articleFromId(x.id).toLowerCase().includes(fa));
  }

  if (p.vendorItems && p.vendorItems.length > 0) {
    const allowed = new Set(p.vendorItems);
    list = list.filter((x) => allowed.has(x.category));
  }

  let priceMin = p.priceMin;
  let priceMax = p.priceMax;
  if (
    priceMin != null &&
    priceMax != null &&
    !Number.isNaN(priceMin) &&
    !Number.isNaN(priceMax) &&
    priceMin > priceMax
  ) {
    [priceMin, priceMax] = [priceMax, priceMin];
  }

  if (priceMin != null && !Number.isNaN(priceMin)) {
    list = list.filter((x) => x.price >= priceMin!);
  }
  if (priceMax != null && !Number.isNaN(priceMax)) {
    list = list.filter((x) => x.price <= priceMax!);
  }

  let ratingMin = p.ratingMin;
  let ratingMax = p.ratingMax;
  if (
    ratingMin != null &&
    ratingMax != null &&
    !Number.isNaN(ratingMin) &&
    !Number.isNaN(ratingMax) &&
    ratingMin > ratingMax
  ) {
    [ratingMin, ratingMax] = [ratingMax, ratingMin];
  }
  if (ratingMin != null && !Number.isNaN(ratingMin)) {
    ratingMin = Math.min(5, Math.max(0, ratingMin));
  }
  if (ratingMax != null && !Number.isNaN(ratingMax)) {
    ratingMax = Math.min(5, Math.max(0, ratingMax));
  }

  if (ratingMin != null && !Number.isNaN(ratingMin)) {
    list = list.filter((x) => ratingFromId(x.id) >= ratingMin!);
  }
  if (ratingMax != null && !Number.isNaN(ratingMax)) {
    list = list.filter((x) => ratingFromId(x.id) <= ratingMax!);
  }

  return list;
}

export function sortProducts(
  products: IProduct[],
  sortBy: string | undefined,
  order: 'asc' | 'desc' | undefined,
): IProduct[] {
  if (!sortBy) {
    return products;
  }
  const dir = order === 'desc' ? -1 : 1;
  const list = [...products];
  list.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return dir * a.title.localeCompare(b.title, 'ru');
      case 'category':
        return dir * a.category.localeCompare(b.category, 'ru');
      case 'article': {
        const sa = articleFromId(a.id);
        const sb = articleFromId(b.id);
        return dir * sa.localeCompare(sb, 'ru');
      }
      case 'rating':
        return dir * (ratingFromId(a.id) - ratingFromId(b.id));
      case 'price':
        return dir * (a.price - b.price);
      default:
        return 0;
    }
  });
  return list;
}
