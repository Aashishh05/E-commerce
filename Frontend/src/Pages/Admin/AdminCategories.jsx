import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Tag,
  Loader,
  ImageIcon,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../utils/axios.js";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/api/admin/categories/getall`);
      setCategories(res.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await API.delete(`/api/admin/categories/delete/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error("Failed to delete category");
      console.log(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all font-semibold"
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
            Manage product categories
          </p>
        </div>
      </motion.div>

      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/50"
      />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader className="animate-spin text-emerald-400" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((cat, i) => (
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

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold"
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
