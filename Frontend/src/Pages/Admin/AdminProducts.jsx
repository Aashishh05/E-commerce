import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Trash2,
  Filter,
  AlertCircle,
  RefreshCw,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../utils/axios.js";

const LIMIT = 2;

const Stat = ({ label, val, color }) => (
  <div
    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex gap-2 ${color}`}
  >
    <span className="font-bold font-mono text-sm">{val}</span>
    <span className="opacity-70">{label}</span>
  </div>
);

const Btn = ({ active, onClick, children, variant = "purple" }) => {
  const styles = {
    purple: active
      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
      : "bg-white/5 text-white/35 border-white/[0.08] hover:text-white/60",
    white: active
      ? "bg-white/[0.12] text-white/80 border-white/20"
      : "bg-white/5 text-white/30 border-white/[0.08] hover:text-white/50",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const debounce = useRef(null);

  // fetch categories once on mount
  useEffect(() => {
    API.get("/api/admin/categories/getall?limit=100")
      .then((r) =>
        setCategories(["All", ...(r.data.data ?? []).map((c) => c.name)]),
      )
      .catch(() => {});
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set("search", search);
      if (cat !== "All") params.set("category", cat);
      if (status !== "All") params.set("status", status.toLowerCase());

      const { data } = await API.get(`/api/admin/products?${params}`);

      setProducts(data.data ?? []);
      setPagination({
        total: data.totalProducts ?? 0,
        pages: data.totalPages ?? 1,
      });
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 400);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setDeleting(id);
      await API.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  // re-fetch whenever filters or page change
  useEffect(() => {
    fetchProducts();
  }, [search, cat, status, page]);

  const handleRetry = () => {
    setSearch("");
    setCat("All");
    setStatus("All");
    setPage(1);
  };

  // helpers to safely read product fields
  const getImg = (p) =>
    p.images?.[0]?.url ??
    p.image?.url ??
    (typeof p.images?.[0] === "string" ? p.images[0] : null);
  const getCat = (p) =>
    typeof p.category === "object" ? p.category?.name : p.category;
  const getSeller = (p) =>
    typeof p.seller === "object"
      ? (p.seller?.shopName ?? p.seller?.name ?? "—")
      : (p.seller ?? "—");

  const activeCount = products.filter(
    (p) => p.isActive !== false && p.status !== "inactive",
  ).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white text-2xl font-bold flex items-center gap-2">
          <ShoppingBag size={20} className="text-purple-400" /> Product Catalog
        </h1>
        <p className="text-white/30 text-sm mt-1">
          View, filter, or remove products across all sellers
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
        className="flex flex-wrap gap-3"
      >
        <Stat
          label="Total"
          val={pagination.total}
          color="text-white/50 border-white/10 bg-white/5"
        />
        <Stat
          label="This page"
          val={products.length}
          color="text-purple-400 border-purple-500/20 bg-purple-500/10"
        />
        <Stat
          label="Active"
          val={activeCount}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <Stat
          label="Out of Stock"
          val={outOfStockCount}
          color="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-white/25" />
          {categories.map((c) => (
            <Btn
              key={c}
              active={cat === c}
              onClick={() => {
                setCat(c);
                setPage(1);
              }}
            >
              {c}
            </Btn>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {["All", "Active", "Inactive"].map((s) => (
            <Btn
              key={s}
              variant="white"
              active={status === s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
            >
              {s}
            </Btn>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search products..."
            onChange={handleSearch}
            className="bg-white/5 border border-white/[0.08] text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-56 focus:outline-none focus:border-purple-500/40 placeholder-white/20"
          />
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-16"
        >
          <AlertCircle className="text-red-500 mb-4" size={36} />
          <p className="text-white/60 mb-4 text-sm">{error}</p>
          <button
            onClick={handleRetry}
            className="text-purple-400 flex items-center gap-2 font-semibold text-sm hover:text-purple-300"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </motion.div>
      )}

      {/* Table */}
      {!error && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl border border-white/[0.08] bg-[#161B27] overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_80px_90px_56px] px-5 py-3 border-b border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-white/25">
            <span>Product</span>
            <span className="hidden lg:block">Seller</span>
            <span className="hidden md:block">Category</span>
            <span className="text-center">Stock</span>
            <span className="text-right">Price</span>
            <span />
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader className="animate-spin text-purple-400" size={24} />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="py-16 text-center text-white/20 text-sm">
              No products match your filters.
            </div>
          )}

          {/* Product Rows */}
          <AnimatePresence mode="popLayout">
            {!loading &&
              products.map((p, i) => {
                const isActive =
                  p.isActive !== false && p.status !== "inactive";
                const isDeleting = deleting === p._id;
                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.22, delay: i * 0.025 }}
                    className={`grid grid-cols-[2fr_1fr_1fr_80px_90px_56px] items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${!isActive ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/[0.08] bg-white/5 shrink-0 flex items-center justify-center">
                        {getImg(p) ? (
                          <img
                            src={getImg(p)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag size={14} className="text-white/10" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/80 text-xs font-semibold truncate">
                          {p.name}
                        </p>
                        <p className="text-white/25 text-[10px] lg:hidden">
                          {getSeller(p)}
                        </p>
                        <p className="text-white/25 text-[10px] md:hidden">
                          {getCat(p)}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/35 text-xs truncate hidden lg:block pr-4">
                      {getSeller(p)}
                    </p>

                    <div className="hidden md:block">
                      {getCat(p) ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/15 text-purple-400 text-[10px] font-semibold">
                          {getCat(p)}
                        </span>
                      ) : (
                        <span className="text-white/20 text-[10px]">—</span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-mono text-center ${(p.stock ?? 0) === 0 ? "text-red-400 font-bold" : "text-white/50"}`}
                    >
                      {(p.stock ?? 0) === 0 ? "Out" : p.stock}
                    </p>

                    <p className="text-white/70 text-xs font-mono font-bold text-right">
                      ${Number(p.price ?? 0).toFixed(2)}
                    </p>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleDelete(p._id)}
                        disabled={isDeleting}
                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 flex items-center justify-center disabled:opacity-40"
                      >
                        {isDeleting ? (
                          <Loader size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {!error && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between text-xs text-white/30"
        >
          <span>
            Page {page} of {pagination.pages} — {pagination.total} products
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1 || loading}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/50"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const num =
                pagination.pages <= 5
                  ? i + 1
                  : page <= 3
                    ? i + 1
                    : page >= pagination.pages - 2
                      ? pagination.pages - 4 + i
                      : page - 2 + i;
              return (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  disabled={loading}
                  className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${num === page ? "border-purple-500/30 bg-purple-500/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"}`}
                >
                  {num}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.pages || loading}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/50"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
