export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-emerald-100 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8">
        <p className="font-bold text-emerald-900">
          বাজার দর <span className="font-normal text-slate-400">—</span>{" "}
          <span className="font-medium text-slate-600">প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
        </p>
        <p className="text-xs leading-6 text-slate-500 sm:text-sm md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
