"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useToast } from "../../components/ToastProvider";

export default function ProfileForm({ initialName, email }) {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      toast.error("নাম লিখুন।");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে।");
    } catch {
      toast.error("তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900">
          <span aria-hidden="true">←</span> হোম পেজে ফিরুন
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-800" aria-hidden="true">
              {initialName.slice(0, 1) || "ব"}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-700">আমার অ্যাকাউন্ট</p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">প্রোফাইল তথ্য</h1>
            </div>
          </div>

          <div className="mt-7 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">ইমেইল</p>
            <p className="mt-1 break-all font-medium text-slate-800">{email}</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              নাম
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={80}
                defaultValue={initialName}
                className="mt-2 block h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {isSaving ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
