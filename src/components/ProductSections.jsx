import ProductCard from "./ProductCard";

function ProductGrid({ products, emptyMessage }) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center text-slate-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function MoverSection({ title, direction, products, loading }) {
  const isUp = direction === "up";
  const movers = products
    .filter((product) => product.change?.dir === direction)
    .sort((a, b) => Math.abs(Number(b.change.pct) || 0) - Math.abs(Number(a.change.pct) || 0))
    .slice(0, 6);

  return (
    <section aria-labelledby={`${direction}-heading`} className="mt-12 sm:mt-16">
      <div className="mb-5 flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-xl text-lg ${!isUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`} aria-hidden="true">
          {isUp ? "▲" : "▼"}
        </span>
        <h2 id={`${direction}-heading`} className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {loading ? (
        <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">দামের তথ্য লোড হচ্ছে…</p>
      ) : (
        <ProductGrid products={movers} emptyMessage="এই মুহূর্তে কোনো দামের পরিবর্তন নেই।" />
      )}
    </section>
  );
}

export default function ProductSections({
  products,
  loading,
  error,
  categoryName,
}) {
  const title = categoryName ? `${categoryName} পণ্যসমূহ` : "সব পণ্য";

  return (
    <div className="pb-16 sm:pb-24">
      <MoverSection title="আজ দাম বেড়েছে" direction="up" products={products} loading={loading} />
      <MoverSection title="আজ দাম কমেছে" direction="down" products={products} loading={loading} />

      <section id="সব-পণ্য" aria-labelledby="all-products-heading" className="scroll-mt-6 pt-14 sm:pt-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-emerald-700">বাজারদর এক নজরে</p>
            <h2 id="all-products-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-slate-600">আজকের বাজারদর ও পণ্যের পরিবর্তন দেখুন।</p>
          </div>
          {!loading && !error && (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
              {products.length}টি পণ্য
            </span>
          )}
        </div>

        {loading ? (
          <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">সব পণ্য লোড হচ্ছে…</p>
        ) : error ? (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            পণ্যের তথ্য আনা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
        ) : (
          <ProductGrid products={products} emptyMessage="এই বিভাগে কোনো পণ্য পাওয়া যায়নি।" />
        )}
      </section>
    </div>
  );
}
