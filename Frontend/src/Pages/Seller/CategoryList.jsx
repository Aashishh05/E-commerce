import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Tag, AlertCircle } from "lucide-react";
import API from "../../utils/axios";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const CategoryList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/category/getall`);
      console.log(res.data.data);
      setCategories(res.data.data);
    } catch (error) {
      setError("Error fetching categories", error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || c.status === statusFilter),
  );

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c._id !== id));
    setDeleteId(null);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Header Section ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="text-green-700" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              Category Management
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Categories
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {categories.length} categories in your store
          </p>
        </div>
        <motion.button
          variants={fadeUp}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 12px 32px rgba(22, 101, 52, 0.25)",
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/category-form")}
          className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer h-fit"
        >
          <Plus size={16} />
          Add Category
        </motion.button>
      </motion.div>

      {/* ── Search & Filter Section ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <motion.div
            className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl px-5 py-3 focus-within:border-green-800/50 focus-within:ring-2 focus-within:ring-green-800/10 transition-all"
            whileFocus={{ scale: 1.01 }}
          >
            <Search size={15} className="text-stone-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="outline-none bg-transparent text-sm w-full placeholder-stone-400 font-medium"
            />
          </motion.div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((status) => (
            <motion.button
              key={status}
              onClick={() => setStatusFilter(status)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                statusFilter === status
                  ? "border-green-800 bg-green-50 text-green-800 shadow-sm"
                  : "border-stone-200/60 bg-white/50 text-stone-600 hover:border-green-300 hover:text-stone-800"
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Categories Grid ── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((cat) => (
              <motion.div
                key={cat._id}
                variants={fadeUp}
                layout
                exit={{ opacity: 0, scale: 0.93, y: 10 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 48px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.25 },
                }}
                className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl overflow-hidden group shadow-sm transition-all"
              >
                {/* Image Banner */}
                <div className="relative h-36 bg-stone-200 overflow-hidden">
                  <motion.img
                    src={cat.image?.url || "https://placehold.co/300x150?text=No+Image"}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <motion.span
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-2 shadow-lg ${
                      cat.isActive === "active"
                        ? "text-green-800 bg-green-50/95 border-green-300/60"
                        : "text-stone-600 bg-stone-100/95 border-stone-300/60"
                    }`}
                  >
                    {cat.isActive ? "active" :"inactive"}
                  </motion.span>

                  {/* Product Count Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-white/60 text-[10px] font-bold text-stone-700 rounded-full shadow-lg"
                  >
                    {cat.productsCount || 0} items
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-2">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3 line-clamp-2">
                      {cat.description}
                    </p>
                    <p className="text-[10px] font-mono text-stone-400 mb-4">
                      /{cat.slug}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 pt-4 border-t border-stone-100/60"
                  >
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() =>
                        navigate(`/seller/categories/${cat._id}/edit`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs bg-gradient-to-r from-green-700 to-green-800 text-white text-sm font-semibold rounded-2xl transition-all"
                    >
                      <Edit2 size={13} />
                      Edit
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setDeleteId(cat._id)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-red-700 to-red-800 text-white text-sm rounded-2xl font-semibold  transition-all"
                    >
                      <Trash2 size={13} />
                      Delete
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="col-span-full flex flex-col items-center justify-center py-24 text-stone-400"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4 p-4 rounded-full bg-stone-100/60"
              >
                <Tag size={40} className="opacity-40" />
              </motion.div>
              <p className="font-semibold text-stone-600 text-center mb-2">
                No categories found
              </p>
              <p className="text-xs text-stone-500 text-center mb-6">
                {search
                  ? "Try a different search term"
                  : "Create your first category to get started"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/category-form")}
                className="text-sm text-green-700 font-bold flex items-center gap-2 hover:text-green-900 cursor-pointer bg-green-50/60 px-4 py-2 rounded-xl border border-green-200/60 transition-all"
              >
                <Plus size={14} />
                Add First Category
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 z-50 w-full max-w-md border border-stone-200/60"
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="p-2 rounded-full bg-red-100/60">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Delete Category?
                  </h3>
                </div>
              </motion.div>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                This action cannot be undone. All products in this category will
                become uncategorized. Are you sure?
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ backgroundColor: "#dc2626" }}
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-md"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 border-2 border-stone-200/60 text-stone-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-stone-100/50 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryList;
