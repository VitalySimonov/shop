export function formatPriceRub(n: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(n)
    .replace(/\u00a0/g, ' ');
}

export function splitPriceFormatted(formatted: string): {
  integerPart: string;
  fractionPart: string;
} {
  const i = formatted.lastIndexOf(',');
  if (i === -1) {
    return { integerPart: formatted, fractionPart: '' };
  }
  return {
    integerPart: formatted.slice(0, i),
    fractionPart: formatted.slice(i),
  };
}

export function parseOptNumber(key: string, searchParams: URLSearchParams): number | undefined {
  const v = searchParams.get(key);
  if (v === null || v === '') {
    return undefined;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function buildPageList(current: number, totalPages: number, max = 5): number[] {
  if (totalPages <= 0) {
    return [];
  }
  if (totalPages <= max) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(totalPages, start + max - 1);
  if (end - start + 1 < max) {
    start = Math.max(1, end - max + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
