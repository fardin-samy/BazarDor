'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/BazarDorNavbar";
import HeroSection from "../components/HeroSection";

const CATEGORIES_API = "https://openapi.programming-hero.com/api/bazardor/categories";

export default function App() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

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
        setActiveCategory(data[0]?.id ?? null);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setCategoriesError(true);
        }
      } finally {
        if (!controller.signal.aborted) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        user={user}
        categories={categories}
        activeCategory={activeCategory}
        onSignIn={() => window.alert("Connect your sign-in flow here.")}
        onSignUp={() => window.alert("Connect your sign-up flow here.")}
        onSignOut={() => setUser(null)}
        onCategoryChange={setActiveCategory}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <HeroSection />
        
      </main>
    </div>
  );
}
