export default function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
    >
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
