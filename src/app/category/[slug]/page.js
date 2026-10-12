"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import ProductCard, { formatBanglaNumber } from "../../../components/ProductCard";
import {
  getCategoryApiUrl,
  getCategoryProductsApiUrl,
} from "../../../lib/bazardor-api";

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex justify-between">
        <div className="size-14 rounded-2xl bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="h-5 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

function CategoryPageContent() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategoryAndProducts() {
      setLoading(true);
      setNotFound(false);
      setError(false);
      setCategory(null);
      setProducts([]);

      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(getCategoryApiUrl(slug), { signal: controller.signal }),
          fetch(getCategoryProductsApiUrl(slug), { signal: controller.signal }),
        ]);

        if (categoryResponse.status === 404 || productsResponse.status === 404) {
          setNotFound(true);
          return;
        }
        if (!categoryResponse.ok || !productsResponse.ok) {
          throw new Error("Category data could not be loaded.");
        }

        const [categoryJson, productsJson] = await Promise.all([
          categoryResponse.json(),
          productsResponse.json(),
        ]);
        const categoryData = categoryJson.category ?? categoryJson.data ?? categoryJson;
        const productList = Array.isArray(productsJson)
          ? productsJson
          : productsJson.products ?? productsJson.data;

        if (!categoryData?.id || !categoryData?.nameBn || !Array.isArray(productList)) {
          setNotFound(true);
          return;
        }

        if (categoryData.slug !== slug) {
          setNotFound(true);
          return;
        }

        setCategory(categoryData);
        setProducts(productList);
        setNotFound(productList.length === 0);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCategoryAndProducts();
    return () => controller.abort();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortOrder === "asc") sorted.sort((a, b) => Number(a.today) - Number(b.today));
    if (sortOrder === "desc") sorted.sort((a, b) => Number(b.today) - Number(a.today));
    return sorted;
  }, [products, sortOrder]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
          <span aria-hidden="true">←</span> হোম পেজ
        </Link>

        {loading ? (
          <section aria-label="পণ্য লোড হচ্ছে" className="mt-6">
            <div className="mb-7 animate-pulse">
              <div className="h-10 w-64 rounded bg-slate-200" />
              <div className="mt-3 h-5 w-80 max-w-full rounded bg-slate-100" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
            </div>
          </section>
        ) : notFound ? (
          <section role="status" className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <span className="text-5xl" aria-hidden="true">🧺</span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">এই বিভাগে কোনো পণ্য পাওয়া যায়নি</h1>
            <p className="mt-2 text-slate-600">বিভাগটি নেই অথবা এই বিভাগে এখনো পণ্য যোগ করা হয়নি।</p>
            <Link href="/" className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800">
              হোম পেজে ফিরে যান
            </Link>
          </section>
        ) : error ? (
          <section role="alert" className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-800">
            <h1 className="text-xl font-bold">বিভাগের তথ্য আনা যায়নি</h1>
            <p className="mt-2">অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
            <Link href="/" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">
              হোম পেজে ফিরে যান
            </Link>
          </section>
        ) : (
          <>
            <header className="mt-6 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">বাজারদর এক নজরে</p>
                <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  <span aria-hidden="true">{category.icon}</span>
                  {category.nameBn}
                </h1>
                <p className="mt-2 text-slate-600">এই বিভাগের {formatBanglaNumber(products.length)}টি পণ্যের আজকের বাজারদর।</p>
              </div>

              <label className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm sm:self-auto">
                <span>সাজান:</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="min-w-40 cursor-pointer bg-transparent font-semibold text-emerald-800 outline-none"
                  aria-label="পণ্যের দাম অনুযায়ী সাজান"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="asc">দাম: কম থেকে বেশি</option>
                  <option value="desc">দাম: বেশি থেকে কম</option>
                </select>
              </label>
            </header>

            <section aria-label={`${category.nameBn} পণ্য`} className="pt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={(
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">বিভাগ লোড হচ্ছে…</p>
        </div>
      </main>
    )}>
      <CategoryPageContent />
    </Suspense>
  );
}
