"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "../../../lib/auth-client";
import SocialAuthButtons from "../../../components/SocialAuthButtons";
import { useToast } from "../../../components/ToastProvider";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("error")) return;

    window.sessionStorage.removeItem("bazarDor:auth-success-toast");
    window.history.replaceState({}, "", "/sign-up");
    const timeoutId = window.setTimeout(
      () => toast.error("সামাজিক অ্যাকাউন্ট দিয়ে নিবন্ধন করা যায়নি। OAuth সেটিংস যাচাই করুন।"),
      0
    );
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      const message = "দুটি পাসওয়ার্ড মিলছে না।";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
      setError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (signUpError) {
        const message = signUpError.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("নিবন্ধন সফল হয়েছে। এখন সাইন ইন করুন।");
      router.replace("/sign-in");
      router.refresh();
    } catch {
      const message = "সার্ভারের সঙ্গে সংযোগ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-28 size-80 rounded-full bg-emerald-100/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 size-96 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-4xl border border-white bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-emerald-800 p-10 text-white lg:flex">
          <div aria-hidden="true" className="absolute -right-20 top-28 size-72 rounded-full border-36 border-white/5" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-24 size-80 rounded-full bg-emerald-700" />

          <Link href="/" className="relative z-10 inline-flex items-center gap-3 text-xl font-bold">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-2xl">🛒</span>
            বাজার দর
          </Link>

          <div className="relative z-10 py-10">
            <p className="text-sm font-semibold tracking-wide text-emerald-200">আপনার বাজার, আপনার হাতে</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">
              বাজারদরের<br />সহজ ঠিকানা
            </h1>
            <p className="mt-5 max-w-xs leading-7 text-emerald-100">
              অ্যাকাউন্ট তৈরি করে পণ্যের দর ও বাজারের হালনাগাদ তথ্য সহজে দেখুন।
            </p>
          </div>

          <p className="relative z-10 text-xs text-emerald-200">সতেজ • সাশ্রয়ী • সহজ</p>
        </aside>

        <section className="px-6 py-9 sm:px-12 sm:py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700">
            <span aria-hidden="true">←</span> হোম পেজে ফিরুন
          </Link>

          <header className="mt-8">
            <p className="text-sm font-bold text-emerald-700">নতুন অ্যাকাউন্ট</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">নিবন্ধন করুন</h2>
            <p className="mt-2 text-slate-500">আপনার তথ্য দিয়ে বাজার দর-এ যোগ দিন।</p>
          </header>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              আপনার নাম
              <input
                autoComplete="name"
                required
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                placeholder="যেমন: রহিম উদ্দিন"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              ইমেইল ঠিকানা
              <input
                autoComplete="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                placeholder="name@example.com"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              পাসওয়ার্ড
              <input
                autoComplete="new-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                placeholder="কমপক্ষে ৮ অক্ষর"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              পাসওয়ার্ড নিশ্চিত করুন
              <input
                autoComplete="new-password"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                placeholder="পাসওয়ার্ডটি আবার লিখুন"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <SocialAuthButtons disabled={isSubmitting} errorCallbackURL="/sign-up" />

          <p className="mt-7 text-center text-sm text-slate-600">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/sign-in" className="font-bold text-emerald-700 hover:text-emerald-800">
              সাইন ইন করুন
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
