import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { auth } from "../../../lib/auth";
import { PRODUCTS_API } from "../../../lib/bazardor-api";

async function ProtectedProductDetail({ params }) {
  const { slug } = await params;
  const productsResponse = await fetch(PRODUCTS_API, { cache: "no-store" });
  if (!productsResponse.ok) {
    throw new Error(`Product request failed (${productsResponse.status})`);
  }

  const responseData = await productsResponse.json();
  const products = Array.isArray(responseData)
    ? responseData
    : responseData.products ?? responseData.data;
  const product = products?.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/sign-in?reason=auth_required&callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }

  return <ProductDetailClient productId={product.id} />;
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
