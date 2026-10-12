"use client";

import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { useToast } from "./ToastProvider";

export default function SocialAuthButtons({
  disabled = false,
  callbackURL = "/",
  errorCallbackURL = "/sign-in",
}) {
  const [providerPending, setProviderPending] = useState("");
  const toast = useToast();

  async function handleGoogleSignIn() {
    setProviderPending("google");

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL,
        newUserCallbackURL: "/",
        disableRedirect: true,
      });

      if (error) {
        toast.error(error.message || "Google দিয়ে সাইন ইন করা যায়নি।");
        setProviderPending("");
        return;
      }

      if (!data?.url) {
        toast.error("Google সাইন-ইন লিংক তৈরি করা যায়নি। OAuth সেটিংস যাচাই করুন।");
        setProviderPending("");
        return;
      }

      window.sessionStorage.setItem(
        "bazarDor:auth-success-toast",
        "Google দিয়ে সাইন ইন সফল হয়েছে।"
      );
      window.location.assign(data.url);
    } catch {
      toast.error("Google OAuth চালু নেই। .env-এ Google client ID এবং secret যাচাই করুন।");
      setProviderPending("");
    }
  }

  return (
    <div className="space-y-3">
      <div className="my-6 flex items-center gap-4 text-xs font-medium text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        অথবা
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || Boolean(providerPending)}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
      >
        <span className="grid size-6 place-items-center rounded-full border border-slate-200 text-sm font-bold text-blue-600" aria-hidden="true">G</span>
        {providerPending === "google" ? "Google-এ যাচাই হচ্ছে…" : "Google দিয়ে চালিয়ে যান"}
      </button>

    </div>
  );
}
