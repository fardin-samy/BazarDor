'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/BazarDorNavbar";
import HeroSection from "../components/HeroSection";
import ProductSections from "../components/ProductSections";
import { CATEGORIES_API, PRODUCTS_API, getCategoryApiUrl } from "../lib/bazardor-api";

export default function App() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryInfo, setActiveCategoryInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch(CATEGORIES_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Category request failed (${response.status})`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || !data.every(
          (category) => category.id && category.nameBn && category.icon
        )) {
          throw new Error("The category response has an unexpected format.");
        }

        setCategories(data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Failed to load product categories", fetchError);
        }
      }
    }

    loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Product request failed (${response.status})`);
        }

        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.products ?? data.data;
        if (!Array.isArray(productList) || !productList.every(
          (product) => product.id && product.nameBn && product.change
        )) {
          throw new Error("The product response has an unexpected format.");
        }

        setProducts(productList);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setProductsError(true);
      } finally {
        if (!controller.signal.aborted) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!activeCategory) return undefined;

    const controller = new AbortController();

    async function loadCategory() {
      try {
        const response = await fetch(getCategoryApiUrl(activeCategory), {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Category detail request failed (${response.status})`);
        }

        const data = await response.json();
        const category = data.category ?? data.data ?? data;
        if (!category.id || !category.nameBn) {
          throw new Error("The category response has an unexpected format.");
        }

        setActiveCategoryInfo(category);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setActiveCategoryInfo(categories.find((category) => category.id === activeCategory) ?? null);
        }
      }
    }

    loadCategory();
    return () => controller.abort();
  }, [activeCategory, categories]);

  function handleCategoryChange(categoryId) {
    setActiveCategory(categoryId);
    setActiveCategoryInfo(
      categories.find((category) => category.id === categoryId) ?? null
    );
  }

  const visibleProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        user={user}
        categories={categories}
        activeCategory={activeCategory}
        onSignIn={() => router.push("/sign-in")}
        onSignUp={() => router.push("/sign-up")}
        onSignOut={() => setUser(null)}
        onCategoryChange={handleCategoryChange}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <ProductSections
          products={visibleProducts}
          loading={productsLoading}
          error={productsError}
          categoryName={activeCategoryInfo?.nameBn}
        />
      </main>
    </div>
  );
}
