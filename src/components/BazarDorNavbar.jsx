"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Sample prices for the ticker; the categories endpoint does not provide prices.
const SAMPLE_PRICES = [
  { emoji: "🥔", name: "আলু", price: "৩৫", unit: "কেজি", change: "২.৪%", direction: "up" },
  { emoji: "🧅", name: "পেঁয়াজ", price: "৬০", unit: "কেজি", change: "১.২%", direction: "down" },
  { emoji: "🥚", name: "ডিম", price: "১৪৫", unit: "ডজন", change: "০.৮%", direction: "up" },
  { emoji: "🐟", name: "রুই মাছ", price: "৩২০", unit: "কেজি", change: "৩.১%", direction: "up" },
  { emoji: "🍚", name: "চাল", price: "৬৮", unit: "কেজি", change: "০.৫%", direction: "down" },
  { emoji: "🌶️", name: "কাঁচা মরিচ", price: "৮০", unit: "কেজি", change: "৪.৬%", direction: "up" },
];

function PriceTickerItem({ item }) {
  const isUp = item.direction === "up";

  return (
    <div className="flex h-full shrink-0 items-center gap-2 border-r border-white/15 px-5 text-xs whitespace-nowrap sm:px-6 sm:text-sm">
      <span aria-hidden="true" className="text-base">{item.emoji}</span>
      <span className="text-green-100">{item.name}</span>
      <span className="font-bold text-white">
        {item.price}৳<span className="font-normal text-green-200">/{item.unit}</span>
      </span>
      <span className={`text-[11px] font-bold ${isUp ? "text-red-200" : "text-green-300"}`}>
        {isUp ? "▲" : "▼"} {item.change}
      </span>
    </div>
  );
}

export default function BazarDorNavbar({
  user = null,
  onSignIn = () => {},
  onSignUp = () => {},
  onSignOut = () => {},
  categories = [],
  activeCategory,
  onCategoryChange = () => {},
  prices = SAMPLE_PRICES,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  function selectCategory(category) {
    onCategoryChange(category.id);
    setMobileOpen(false);
    document.getElementById("আজ-দাম-বেড়েছে")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function selectAllProducts() {
    onCategoryChange(null);
    setMobileOpen(false);
    document.getElementById("সব-পণ্য")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="relative z-40 w-full border-b border-gray-100 bg-white shadow-sm" style={{ fontFamily: '"Hind Siliguri", sans-serif' }}>
      {/* First row: logo + date + authentication */}
      <div className="mx-auto flex min-h-20.5 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-green-50 text-2xl">
            🛒
          </span>

          <span className="flex min-w-0 flex-col">
            <span className="text-xl font-bold leading-tight tracking-tight text-green-800 sm:text-2xl">
              বাজার দর
            </span>
            <span className="mt-1 text-[11px] text-gray-500 sm:text-xs">
              {date || "আজকের বাজারদর"}
            </span>
          </span>
        </Link>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="grid size-8 place-items-center rounded-full bg-green-100 text-green-800">
                    {(user.name || "ব").slice(0, 1)}
                  </span>
                )}
                <span className="max-w-32 truncate">{user.name || "আমার অ্যাকাউন্ট"}</span>
                <span>⌄</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  {user.email && (
                    <p className="break-all px-3 py-2 text-xs text-gray-500">
                      {user.email}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onSignOut();
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onSignIn}
                className="rounded-lg border border-green-700 px-5 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                সাইন ইন
              </button>
              <button
                type="button"
                onClick={onSignUp}
                className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                সাইন আপ
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="মেনু খুলুন"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-green-100 text-xl text-green-800 sm:hidden"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Second row: categories */}
      <nav
        aria-label="পণ্যের বিভাগ"
        className={`${mobileOpen ? "block" : "hidden"} border-t border-gray-100 sm:block`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 sm:min-h-14 sm:flex-row sm:items-stretch sm:justify-center sm:gap-1 sm:px-6 sm:py-0 lg:px-8">
          
          {categories.map((category) => {
            const active = activeCategory === category.id;

            return (
              <button
                type="button"
                key={category.id}
                aria-current={active ? "page" : undefined}
                onClick={() => selectCategory(category)}
                className={`relative shrink-0 rounded-lg px-4 py-3 text-left text-sm transition sm:rounded-b-none sm:rounded-t-lg sm:text-center ${
                  active
                    ? "bg-green-50 font-bold text-green-800 sm:after:absolute sm:after:inset-x-3 sm:after:bottom-0 sm:after:h-0.75 sm:after:rounded-t-full sm:after:bg-green-700"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                <span aria-hidden="true" className="mr-1.5">{category.icon}</span>
                {category.nameBn}
                {active && (
                  <span className="absolute inset-y-2 left-0 w-0.75 rounded-r bg-green-700 sm:hidden" />
                )}
              </button>
            );
          })}

          {/* Mobile authentication */}
          <div className="flex gap-2 border-t border-gray-100 pt-3 sm:hidden">
            {user ? (
              <>
                <span className="flex flex-1 items-center text-sm text-gray-600">
                  👤 {user.name}
                </span>
                <button
                  onClick={onSignOut}
                  className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-800"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="flex-1 rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-800"
                >
                  সাইন ইন
                </button>
                <button
                  onClick={onSignUp}
                  className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  সাইন আপ
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Third row: infinite scrolling ticker */}
      <div className="flex h-10 overflow-hidden bg-green-900 text-white sm:h-11">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-green-950 px-3 text-[11px] font-bold sm:px-5 sm:text-xs">
          <span className="size-2 rounded-full bg-green-400 ring-4 ring-green-400/15" />
          নমুনা দাম
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="ticker-track flex h-full w-max animate-[ticker-scroll_36s_linear_infinite] hover:[animation-play-state:paused]"
            role="region"
            aria-label="পণ্যের নমুনা দাম"
          >
            {[prices, prices].map((group, groupIndex) => (
              <div
                key={`price-group-${groupIndex}`}
                className="flex h-full shrink-0"
                aria-hidden={groupIndex === 1 ? "true" : undefined}
              >
                {group.map((item, index) => (
                  <PriceTickerItem key={`${item.name}-${index}`} item={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}