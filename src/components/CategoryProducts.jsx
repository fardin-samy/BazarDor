"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { formatBanglaNumber } from "./ProductCard";

function parsePrice(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const normalized = String(value ?? "")
    .replace(/[০-৯]/g, (digit) => String(digit.charCodeAt(0) - 0x09e6))
    .replace(/[٬,\s]/g, "")
    .replace(/[−–]/g, "-")
    .replace(/[^\d.+-]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export default function CategoryProducts({ category, products }) {
  const [sortOrder, setSortOrder] = useState("default");

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortOrder === "asc") sorted.sort((a, b) => parsePrice(a.today) - parsePrice(b.today));
    if (sortOrder === "desc") sorted.sort((a, b) => parsePrice(b.today) - parsePrice(a.today));
    return sorted;
  }, [products, sortOrder]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
          <span aria-hidden="true">←</span> হোম পেজ
        </Link>

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
            <span className="relative">
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="min-w-40 cursor-pointer appearance-none bg-transparent py-1 pr-7 font-semibold text-emerald-800 outline-none"
                aria-label="পণ্যের দাম অনুযায়ী সাজান"
              >
                <option value="default">ডিফল্ট</option>
                <option value="asc">দাম: কম থেকে বেশি</option>
                <option value="desc">দাম: বেশি থেকে কম</option>
              </select>
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-emerald-700">
                <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </label>
        </header>

        <section aria-label={`${category.nameBn} পণ্য`} className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
