import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryProducts from "../../../components/CategoryProducts";
import ProductCardSkeleton from "../../../components/ProductCardSkeleton";
import {
  getCategoryApiUrl,
  getCategoryProductsApiUrl,
} from "../../../lib/bazardor-api";

async function CategoryContent({ params }) {
  const { slug } = await params;
  const [categoryResponse, productsResponse] = await Promise.all([
    fetch(getCategoryApiUrl(slug), { cache: "no-store" }),
    fetch(getCategoryProductsApiUrl(slug), { cache: "no-store" }),
  ]);

  if (categoryResponse.status === 404 || productsResponse.status === 404) {
    notFound();
  }
  if (!categoryResponse.ok || !productsResponse.ok) {
    throw new Error("Category data could not be loaded.");
  }

  const [categoryJson, productsJson] = await Promise.all([
    categoryResponse.json(),
    productsResponse.json(),
  ]);
  const category = categoryJson.category ?? categoryJson.data ?? categoryJson;
  const products = Array.isArray(productsJson)
    ? productsJson
    : productsJson.products ?? productsJson.data;

  if (!category?.id || !category?.nameBn || category.slug !== slug || !Array.isArray(products) || products.length === 0) {
    notFound();
  }

  return <CategoryProducts category={category} products={products} />;
}

function CategoryLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 animate-pulse">
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-80 max-w-full rounded bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
