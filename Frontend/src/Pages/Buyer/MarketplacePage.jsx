import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Store,
  ShoppingBag,
  LoaderCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/auth/Navbar.jsx";
import Footer from "../../Components/auth/Footer.jsx";
import ProductCard from "../../Components/auth/ProductCard.jsx";
import API from "../../utils/axios.js";

const defaultCategoryImage =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop";

const MarketplacePage = () => {
  const nav = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [catRes, prodRes] = await Promise.all([
          API.get("/api/category/getall"),
          API.get("/api/product/getall?limit=8"),
        ]);

        setCategories(Array.isArray(catRes.data.data) ? catRes.data.data : []);
        setProducts(Array.isArray(prodRes.data.data) ? prodRes.data.data : []);
      } catch (err) {
        console.error("Error fetching marketplace data:", err);
        setError(err.response?.data?.message || "Failed to load marketplace");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Store className="text-green-300" size={20} />
              <span className="text-xs font-extrabold uppercase tracking-widest text-green-300">
                Our Marketplace
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Discover, Shop,<br />Support Local
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto mb-10">
              Explore a thoughtfully curated collection from independent artisans and verified sellers worldwide.
            </p>

            <div className="max-w-xl mx-auto relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Search products, categories, or sellers..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    nav(`/all-products?search=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
                className="w-full pl-13 pr-32 py-4 bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30 shadow-xl"
              />
              <button
                onClick={() => {
                  const val = document.querySelector(".max-w-xl input")?.value;
                  if (val?.trim()) nav(`/all-products?search=${encodeURIComponent(val.trim())}`);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-green-800 hover:bg-green-700 text-white text-sm font-bold rounded-full transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Categories */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Shop by Category
              </h2>
              <p className="text-stone-500 mt-1">
                {categories.length} categories to explore
              </p>
            </div>
            <button
              onClick={() => nav("/all-products")}
              className="text-green-800 hover:text-green-950 font-semibold text-sm flex items-center gap-1 cursor-pointer"
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoaderCircle size={28} className="animate-spin text-green-800" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              No categories available yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() =>
                    nav(`/all-products?category=${cat._id}`)
                  }
                  className="group cursor-pointer bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-40 bg-stone-100 overflow-hidden">
                    <img
                      src={cat?.image?.url || defaultCategoryImage}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = defaultCategoryImage;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-green-800 transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section className="py-16 border-t border-stone-200">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Featured Products
              </h2>
              <p className="text-stone-500 mt-1">
                Handpicked items just for you
              </p>
            </div>
            <button
              onClick={() => nav("/all-products")}
              className="text-green-800 hover:text-green-950 font-semibold text-sm flex items-center gap-1 cursor-pointer"
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoaderCircle size={28} className="animate-spin text-green-800" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <ShoppingBag size={36} className="text-stone-300 mb-4" />
              <p className="text-stone-500">No products available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-stone-200">
          <div className="bg-gradient-to-br from-green-900 to-emerald-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
            </div>
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-green-100 max-w-lg mx-auto mb-8">
                Explore our complete collection of products across all categories and sellers.
              </p>
              <button
                onClick={() => nav("/all-products")}
                className="px-8 py-3 bg-white text-green-900 font-bold rounded-full hover:bg-green-50 transition-colors cursor-pointer shadow-xl inline-flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Browse All Products
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MarketplacePage;
