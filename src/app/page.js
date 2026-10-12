'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/BazarDorNavbar";

const CATEGORIES_API = "https://openapi.programming-hero.com/api/bazardor/categories";

export default function App() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

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
          console.error("Failed to load product categories", fetchError);
        }
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
    </div>
  );
}
