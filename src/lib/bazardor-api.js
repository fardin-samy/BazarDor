const BAZARDOR_API = "https://openapi.programming-hero.com/api/bazardor";

export const PRODUCTS_API = `${BAZARDOR_API}/products`;
export const CATEGORIES_API = `${BAZARDOR_API}/categories`;

export function getProductApiUrl(id) {
  return `${PRODUCTS_API}/${encodeURIComponent(id)}`;
}

export function getCategoryApiUrl(slug) {
  return `${CATEGORIES_API}/${encodeURIComponent(slug)}`;
}
