import Link from "next/link";

export const metadata = {
  title: "পৃষ্ঠা পাওয়া যায়নি | বাজার দর",
};

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-4xl" aria-hidden="true">
          🧺
        </span>
        <p className="mt-6 text-sm font-bold tracking-[0.2em] text-emerald-700">৪০৪</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-3 leading-7 text-slate-600">
          এই ঠিকানায় কোনো পৃষ্ঠা বা পণ্য নেই। লিংকটি পরীক্ষা করুন অথবা হোম পেজে ফিরে যান।
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
