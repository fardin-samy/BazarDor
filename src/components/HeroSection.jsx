"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Dhaka",
        }).format(new Date())
      );
    };

    updateDate();
    const timer = setInterval(updateDate, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mt-6 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 via-white to-amber-50 px-6 py-10 shadow-sm ring-1 ring-emerald-900/5 sm:mt-8 sm:px-10 sm:py-14 lg:px-16"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
            {/* <span aria-hidden="true">🗓️</span> */}
            {date || "আজকের তারিখ"}
          </p>
          <h1 id="hero-heading" className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            আপনার বাজারের
            <span className="block text-emerald-700">সব দর এক জায়গায়</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            নিত্যপ্রয়োজনীয় পণ্যের বিভাগ ঘুরে দেখুন, আর বাজারের দর সম্পর্কে থাকুন সবসময় আপডেট।
          </p>
          <a
            href="#সব-পণ্য"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-base font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            সব পণ্য দেখুন
            {/* <span aria-hidden="true">↓</span> */}
          </a>
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <div aria-hidden="true" className="absolute aspect-square w-[80%] rounded-full bg-emerald-100/80 blur-2xl" />
          <div aria-hidden="true" className="absolute right-[12%] top-[12%] size-14 rounded-full bg-amber-200/70" />
          <Image
            src="/bazar-hero.png"
            alt="তাজা সবজির ঝুড়ি"
            width={275}
            height={300}
            priority
            className="relative z-10 h-auto w-52 drop-shadow-xl sm:w-64 lg:w-72"
            sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 208px"
          />
          <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-white/80 bg-white/90 px-4 py-2 text-center shadow-lg backdrop-blur sm:bottom-4">
            <span className="block text-xs text-slate-500">প্রতিদিনের বাজার</span>
            <span className="text-sm font-bold text-emerald-800">সতেজ • সাশ্রয়ী • সহজ</span>
          </div>
        </div>
      </div>
    </section>
  );
}