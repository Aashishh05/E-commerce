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

const LIMIT = 10;

const Pill = ({ label, val, accent }) => (
  <div
    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${accent}`}
  >
    <span className="text-[15px] font-bold font-mono">{val}</span>
    <span className="opacity-70">{label}</span>
  </div>
);

const Btn = ({ active, onClick, children, variant = "purple" }) => {
  const styles = {
    purple: active
      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
      : "bg-white/5 text-white/35 border-white/[0.08] hover:text-white/60 hover:bg-white/[0.08]",
    white: active
      ? "bg-white/[0.12] text-white/80 border-white/20"
      : "bg-white/5 text-white/30 border-white/[0.08] hover:text-white/50",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const debounce = useRef(null);

  useEffect(() => {
    API.get("/api/admin/categories/getall?limit=100")
      .then((r) =>
        setCategories(["All", ...(r.data.data ?? []).map((c) => c.name)]),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const p = new URLSearchParams({ page, limit: LIMIT });
        if (search) p.set("search", search);
        if (catFilter !== "All") p.set("category", catFilter);
        if (statusFilter === "Active") p.set("status", "active");
        if (statusFilter === "Inactive") p.set("status", "inactive");

        const { data } = await API.get(`/api/admin/products?${p}`);
        if (!alive) return;
        setProducts(data.data ?? []);
        setTotal(data.totalProducts ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch {
        if (alive) setError("Failed to load products.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [page, search, catFilter, statusFilter]);

  const handleSearch = (e) => {
    const val = e.target.value;
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setPage(1);
      setSearch(val);
    }, 400);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/api/admin/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => t - 1);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = products.filter(
    (p) => p.isActive !== false && p.status !== "inactive",
  ).length;
  const outStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <ShoppingBag size={20} className="text-purple-400" /> Product Catalog
        </h1>
        <p className="text-white/30 text-sm mt-1">
          View, filter, or remove products across all sellers
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
        className="flex flex-wrap gap-3"
      >
        <Pill
          label="Total"
          val={total}
          accent="text-white/50 border-white/10 bg-white/5"
        />
        <Pill
          label="This page"
          val={products.length}
          accent="text-purple-400 border-purple-500/20 bg-purple-500/10"
        />
        <Pill
          label="Active"
          val={activeCount}
          accent="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <Pill
          label="Out of Stock"
          val={outStockCount}
          accent="text-amber-400 border-amber-500/20 bg-amber-500/10"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-white/25 shrink-0" />
          {categories.map((c) => (
            <Btn
              key={c}
              active={catFilter === c}
              onClick={() => {
                setCatFilter(c);
                setPage(1);
              }}
            >
              {c}
            </Btn>
          ))}
        </div>
        <div className="flex items-center gap-1.5 sm:ml-2">
          {["All", "Active", "Inactive"].map((s) => (
            <Btn
              key={s}
              variant="white"
              active={statusFilter === s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
            >
              {s}
            </Btn>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={search}
            onChange={handleSearch}
            className="bg-white/5 border border-white/[0.08] text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-56 focus:outline-none focus:border-purple-500/40 placeholder-white/20 transition-all"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <AlertCircle className="text-red-500 mb-4" size={36} />
            <p className="text-white/60 mb-4 text-sm">{error}</p>
            <button
              onClick={() => {
                setPage(1);
                setSearch("");
                setCatFilter("All");
                setStatus("All");
              }}
              className="text-purple-400 flex items-center gap-2 font-semibold text-sm hover:text-purple-300"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!error && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl border border-white/[0.08] bg-[#161B27] overflow-hidden"
        >
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

          <AnimatePresence mode="popLayout">
            {!loading &&
              products.map((product, i) => {
                const isActive =
                  product.isActive !== false && product.status !== "inactive";
                const isDeleting = deletingId === product._id;
                const imgUrl =
                  product.images?.[0]?.url ??
                  product.image?.url ??
                  (typeof product.images?.[0] === "string"
                    ? product.images[0]
                    : null);
                const catName =
                  typeof product.category === "object"
                    ? product.category?.name
                    : product.category;
                const sellerName =
                  typeof product.seller === "object"
                    ? (product.seller?.shopName ?? product.seller?.name ?? "—")
                    : (product.seller ?? "—");

                return (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.22, delay: i * 0.025 }}
                    className={`grid grid-cols-[2fr_1fr_1fr_80px_90px_56px] items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${!isActive ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/[0.08] shrink-0 bg-white/5">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10">
                            <ShoppingBag size={14} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/80 text-xs font-semibold truncate">
                          {product.name}
                        </p>
                        <p className="text-white/25 text-[10px] lg:hidden truncate">
                          {sellerName}
                        </p>
                        <p className="text-white/25 text-[10px] md:hidden">
                          {catName}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/35 text-xs truncate hidden lg:block pr-4">
                      {sellerName ?? "—"}
                    </p>

                    <div className="hidden md:block">
                      {catName ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/15 text-purple-400 text-[10px] font-semibold">
                          {catName}
                        </span>
                      ) : (
                        <span className="text-white/20 text-[10px]">—</span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-mono text-center ${(product.stock ?? 0) === 0 ? "text-red-400 font-bold" : "text-white/50"}`}
                    >
                      {(product.stock ?? 0) === 0 ? "Out" : product.stock}
                    </p>

                    <p className="text-white/70 text-xs font-mono font-bold text-right">
                      ${Number(product.price ?? 0).toFixed(2)}
                    </p>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting}
                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all disabled:opacity-40"
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

      {!error && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between text-xs text-white/30"
        >
          <span>
            Page {page} of {totalPages} — {total} products
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1 || loading}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/50"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p =
                totalPages <= 5
                  ? i + 1
                  : page <= 3
                    ? i + 1
                    : page >= totalPages - 2
                      ? totalPages - 4 + i
                      : page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={loading}
                  className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${p === page ? "border-purple-500/30 bg-purple-500/20 text-purple-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || loading}
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
