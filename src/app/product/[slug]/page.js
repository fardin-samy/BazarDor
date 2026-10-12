import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { auth } from "../../../lib/auth";

async function ProtectedProductDetail({ params }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/sign-in?callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }

  return <ProductDetailClient slug={slug} />;
}

export default function ProductDetailPage({ params }) {
  return (
    <Suspense fallback={(
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
        <p role="status" className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
          পণ্যের তথ্য লোড হচ্ছে…
        </p>
      </main>
    )}>
      <ProtectedProductDetail params={params} />
    </Suspense>
  );
}
