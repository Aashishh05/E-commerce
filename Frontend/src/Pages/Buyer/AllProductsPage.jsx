import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../Components/auth/Navbar.jsx";
import Footer from "../../Components/auth/Footer.jsx";
import ProductCard from "../../Components/auth/ProductCard.jsx";
import API from "../../utils/axios.js";

const priceRanges = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹500", min: "", max: "500" },
  { label: "₹500 - ₹1,000", min: "500", max: "1000" },
  { label: "₹1,000 - ₹5,000", min: "1000", max: "5000" },
  { label: "₹5,000 - ₹10,000", min: "5000", max: "10000" },
  { label: "Above ₹10,000", min: "10000", max: "" },
];

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.get("minPrice") || searchParams.get("maxPrice")
      ? "custom"
      : "",
  );
  const [customMin, setCustomMin] = useState(
    searchParams.get("minPrice") || "",
  );
  const [customMax, setCustomMax] = useState(
    searchParams.get("maxPrice") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get("page")) || 1;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", "12");

      const search = searchParams.get("search");
      const category = searchParams.get("category");
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");

      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const res = await API.get(`/api/product/getall?${params.toString()}`);

      let items = Array.isArray(res.data.data) ? res.data.data : [];

      if (sortBy === "price-low") {
        items = [...items].sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        items = [...items].sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        items = [...items].sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0),
        );
      } else if (sortBy === "popular") {
        items = [...items].sort((a, b) => (b.sold || 0) - (a.sold || 0));
      }

      setProducts(items);
      setPagination(
        res.data.pagination || { total: items.length, page: 1, totalPages: 1 },
      );
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchParams, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/category/getall");
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("search", searchInput.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedPrice === "custom") {
      if (customMin) params.set("minPrice", customMin);
      if (customMax) params.set("maxPrice", customMax);
    } else if (selectedPrice) {
      const range = priceRanges.find((r) => r.label === selectedPrice);
      if (range) {
        if (range.min) params.set("minPrice", range.min);
        if (range.max) params.set("maxPrice", range.max);
      }
    }
    params.set("page", "1");
    setSearchParams(params, { replace: true });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSelectedCategory("");
    setSelectedPrice("");
    setCustomMin("");
    setCustomMax("");
    setSortBy("newest");
    setSearchParams({}, { replace: true });
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    searchParams.get("search") ||
    searchParams.get("category") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice");

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-3">
            All Products
          </h1>
          <p className="text-stone-500 text-lg">
            Browse our complete collection — {pagination.total || 0} products
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-800/20 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                showFilters || hasActiveFilters
                  ? "bg-green-800 text-white border-green-800"
                  : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchParams.get("search") && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-full">
                Search: {searchParams.get("search")}
                <button
                  onClick={() => {
                    setSearchInput("");
                    const params = new URLSearchParams(searchParams);
                    params.delete("search");
                    setSearchParams(params, { replace: true });
                  }}
                  className="cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {searchParams.get("category") && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-full">
                Category:{" "}
                {categories.find((c) => c._id === searchParams.get("category"))
                  ?.name || "Selected"}
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    const params = new URLSearchParams(searchParams);
                    params.delete("category");
                    setSearchParams(params, { replace: true });
                  }}
                  className="cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-full">
                Price: {searchParams.get("minPrice") || "0"} -{" "}
                {searchParams.get("maxPrice") || "∞"}
                <button
                  onClick={() => {
                    setCustomMin("");
                    setCustomMax("");
                    setSelectedPrice("");
                    const params = new URLSearchParams(searchParams);
                    params.delete("minPrice");
                    params.delete("maxPrice");
                    setSearchParams(params, { replace: true });
                  }}
                  className="cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-stone-500 hover:text-red-600 font-semibold cursor-pointer ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={18} className="text-stone-500" />
                    </button>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3">
                      Category
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      <button
                        onClick={() => setSelectedCategory("")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                          !selectedCategory
                            ? "bg-green-50 text-green-800 font-semibold"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat._id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                            selectedCategory === cat._id
                              ? "bg-green-50 text-green-800 font-semibold"
                              : "text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3">
                      Price Range
                    </h4>
                    <div className="space-y-1.5">
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => {
                            setSelectedPrice(range.label);
                            setCustomMin(range.min);
                            setCustomMax(range.max);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                            selectedPrice === range.label
                              ? "bg-green-50 text-green-800 font-semibold"
                              : "text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={customMin}
                        onChange={(e) => {
                          setCustomMin(e.target.value);
                          setSelectedPrice("custom");
                        }}
                        className="w-1/2 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={customMax}
                        onChange={(e) => {
                          setCustomMax(e.target.value);
                          setSelectedPrice("custom");
                        }}
                        className="w-1/2 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20"
                      />
                    </div>
                  </div>

                  <button
                    onClick={applyFilters}
                    className="w-full py-3 bg-green-800 hover:bg-green-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 mt-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <LoaderCircle
              size={32}
              className="animate-spin text-green-800 mb-4"
            />
            <p className="text-stone-500">Loading products...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle size={40} className="text-red-400 mb-4" />
            <p className="text-stone-700 font-semibold mb-2">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-green-800 text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
              <Search size={28} className="text-stone-300" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              No products found
            </h3>
            <p className="text-stone-500 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-green-800 text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="p-2 border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} className="text-stone-600" />
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (pagination.totalPages <= 7) return true;
                    if (p === 1 || p === pagination.totalPages) return true;
                    if (Math.abs(p - page) <= 1) return true;
                    return false;
                  })
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="px-2 text-stone-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                          page === p
                            ? "bg-green-800 text-white shadow-md"
                            : "border border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="p-2 border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} className="text-stone-600" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllProductsPage;
