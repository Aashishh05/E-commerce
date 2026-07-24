import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Tag,
  Loader,
  ImageIcon,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../utils/axios.js";

const LIMIT = 1;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debounce = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [search, page]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set("search", search);

      const res = await API.get(`/api/admin/categories/getall?${params}`);
      setCategories(res.data.data || []);
      setPagination({
        total: res.data.totalCategories ?? 0,
        pages: res.data.totalPages ?? 1,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
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
    try {
      setIsDeleting(true);
      await API.delete(`/api/admin/categories/delete/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      toast.success("Category deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader className="text-emerald-400" size={32} />
        </motion.div>
        <p className="text-white/40 text-sm mt-4">Loading your data...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h3 className="text-white font-bold mb-2">Connection Error</h3>
        <p className="text-white/40 text-sm mb-6 max-w-xs">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchCategories}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 font-semibold"
        >
          <RefreshCw size={16} /> Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-2.5">
            <Tag size={20} className="text-emerald-400" /> Categories
          </h1>
          <p className="text-white/30 text-sm mt-1">
            Manage product categories — {pagination.total} total
          </p>
        </div>
      </motion.div>

      <div className="relative">
        <Search
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search categories..."
          onChange={handleSearch}
          className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500/50 placeholder-white/20"
        />
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader className="animate-spin text-emerald-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-white/20 text-sm">
            No categories found.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-2xl border border-white/10 bg-[#161B27] overflow-hidden"
              >
                <div className="h-40 bg-white/5 flex items-center justify-center overflow-hidden">
                  {cat.image?.url ? (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={40} className="text-white/10" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-sm mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-white/40 text-xs mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                  <button
                    onClick={() => setDeleteId(cat._id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/20"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between text-xs text-white/30"
        >
          <span>
            Page {page} of {pagination.pages} — {pagination.total} categories
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
                  className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${num === page ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"}`}
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

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#161B27] border border-white/10 p-6 rounded-2xl max-w-sm w-full"
            >
              <h3 className="text-white font-bold mb-2">Delete Category?</h3>
              <p className="text-white/50 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 bg-white/5 text-white rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
