"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ProductChangeBadge, formatBanglaNumber, getUnitLabel } from "../../../components/ProductCard";
import { getProductApiUrl } from "../../../lib/bazardor-api";

function ProductDetailContent() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(getProductApiUrl(id), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Product detail request failed (${response.status})`);
        }

        const data = await response.json();
        const productData = data.product ?? data.data ?? data;
        if (!productData.id || !productData.nameBn || !productData.today) {
          throw new Error("The product response has an unexpected format.");
        }

        setProduct(productData);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id]);

  const marketPrices = product?.markets?.flatMap((market) => [market.min, market.max]) ?? [];
  const minPrice = marketPrices.length ? Math.min(...marketPrices) : product?.today;
  const maxPrice = marketPrices.length ? Math.max(...marketPrices) : product?.today;
  const averagePrice = marketPrices.length
    ? marketPrices.reduce((total, price) => total + price, 0) / marketPrices.length
    : product?.today;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
          <span aria-hidden="true">←</span> বাজারে ফিরে যান
        </Link>

        {loading ? (
          <p role="status" className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
            পণ্যের তথ্য লোড হচ্ছে…
          </p>
        ) : error || !product ? (
          <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-900">পণ্যটি পাওয়া যায়নি</p>
            <p className="mt-2 text-slate-600">পণ্যের লিংকটি সঠিক কি না যাচাই করুন।</p>
          </div>
        ) : (
          <>
            <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <span className="grid size-24 shrink-0 place-items-center rounded-3xl bg-emerald-50 text-6xl" aria-hidden="true">
                  {product.image || product.categoryIcon || "🛒"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {product.categoryNameBn && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                        {product.categoryIcon} {product.categoryNameBn}
                      </span>
                    )}
                    <ProductChangeBadge change={product.change} />
                  </div>
                  <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">{product.nameBn}</h1>
                  <p className="mt-2 text-slate-600">{getUnitLabel(product.unit)} • বাজারভিত্তিক আজকের দর</p>
                  <div className="mt-6 inline-flex flex-col rounded-2xl bg-emerald-700 px-5 py-3 text-white">
                    <span className="text-sm text-emerald-100">আজকের দাম</span>
                    <span className="text-2xl font-extrabold">{formatBanglaNumber(product.today)} টাকা</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "সর্বনিম্ন দাম", value: minPrice },
                  { label: "সর্বোচ্চ দাম", value: maxPrice },
                  { label: "গড় দাম", value: averagePrice },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{formatBanglaNumber(value)} টাকা</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="markets-heading" className="mt-8">
              <h2 id="markets-heading" className="text-2xl font-bold text-slate-900">বাজারভিত্তিক আজকের দাম</h2>
              {product.markets?.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.markets.map((market, index) => (
                    <article key={`${market.market}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{market.market}</h3>
                        <p className="mt-1 text-sm text-slate-500">{market.division}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-slate-700">
                        {formatBanglaNumber(market.min)}–{formatBanglaNumber(market.max)} টাকা
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl bg-white p-5 text-slate-600">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
          <p role="status" className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
            পণ্যের তথ্য লোড হচ্ছে…
          </p>
        </main>
      )}
    >
      <ProductDetailContent />
    </Suspense>
  );
}
