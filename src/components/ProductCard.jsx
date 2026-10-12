import Link from "next/link";

const UNIT_LABELS = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  l: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  pcs: "প্রতি পিস",
  piece: "প্রতি পিস",
  gm: "প্রতি গ্রাম",
  g: "প্রতি গ্রাম",
};

const NUMBER_FORMAT = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});
const PERCENT_FORMAT = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatBanglaNumber(value) {
  return NUMBER_FORMAT.format(Number(value) || 0);
}

function formatBanglaPercentage(value) {
  return PERCENT_FORMAT.format(Number(value) || 0);
}

export function getUnitLabel(unit) {
  return UNIT_LABELS[String(unit || "").toLowerCase()] || `প্রতি ${unit || "একক"}`;
}

export function ProductChangeBadge({ change }) {
  const direction = change?.dir;
  const isUp = direction === "up";
  const isDown = direction === "down";
  const badgeClass = isDown
    ? "bg-emerald-50 text-emerald-700"
    : isUp
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-600";
  const percentage = isUp || isDown ? Math.abs(Number(change?.pct) || 0) : 0;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${badgeClass}`}>
      {isUp ? (
        <>▲ {formatBanglaPercentage(percentage)}%</>
      ) : isDown ? (
        <>▼ {formatBanglaPercentage(percentage)}%</>
      ) : (
        <>—{formatBanglaPercentage(0)}%</>
      )}
    </span>
  );
}

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:p-5"
      aria-label={`${product.nameBn}, ${formatBanglaNumber(product.today)} টাকা, পণ্যের বিস্তারিত দেখুন`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-3xl transition group-hover:scale-105" aria-hidden="true">
          {product.image || product.categoryIcon || "🛒"}
        </span>
        <ProductChangeBadge change={product.change} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-800">
        {product.nameBn}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{getUnitLabel(product.unit)}</p>

      <div className="mt-5 flex items-end justify-between gap-2 border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">আজকের দাম</span>
        <span className="text-lg font-extrabold text-slate-900">
          {formatBanglaNumber(product.today)} <span className="text-sm font-semibold text-slate-600">টাকা</span>
        </span>
      </div>
    </Link>
  );
}
