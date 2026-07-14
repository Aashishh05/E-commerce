import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  AlertCircle,
  Tag,
  DollarSign,
  Layers
} from "lucide-react";

// Mock data reflecting the established wellness/sustainable theme
const mockProducts = [
  {
    id: 1,
    name: "Handcrafted Herbal Oils Set",
    sku: "sku-herbal-oils-set",
    category: "Beauty & Skincare",
    price: 45.00,
    stock: 12,
    image: "https://images.unsplash.com/photo-1608248593842-83b6cb46e7f2?w=400&h=400&fit=crop",
    status: "active",
  },
  {
    id: 2,
    name: "Artisan Ceramic Mug",
    sku: "sku-artisan-ceramic-mug",
    category: "Home & Living",
    price: 24.50,
    stock: 0,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop",
    status: "inactive",
  },
  {
    id: 3,
    name: "Bamboo Sonic Toothbrush",
    sku: "sku-bamboo-toothbrush",
    category: "Wellness Tech",
    price: 55.00,
    stock: 45,
    image: "https://images.unsplash.com/photo-1605235555476-eb347c6ce2da?w=400&h=400&fit=crop",
    status: "active",
  },
  {
    id: 4,
    name: "Organic Linen Throw Blanket",
    sku: "sku-linen-throw",
    category: "Home & Living",
    price: 89.00,
    stock: 8,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop",
    status: "active",
  },
  {
    id: 5,
    name: "Botanical Facial Serum",
    sku: "sku-botanical-serum",
    category: "Beauty & Skincare",
    price: 68.00,
    stock: 23,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    status: "active",
  },
];

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

const ProductList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(mockProducts);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || p.status === statusFilter)
  );

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

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
            <Package className="text-green-700" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              Inventory Management
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Products
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {products.length} products in your catalog
          </p>
        </div>
        <motion.button
          variants={fadeUp}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 12px 32px rgba(22, 101, 52, 0.25)",
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/seller/products/new")}
          className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer h-fit"
        >
          <Plus size={16} />
          Add Product
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
              placeholder="Search products by name or SKU…"
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

      {/* ── Products Grid ── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((prod) => (
              <motion.div
                key={prod.id}
                variants={fadeUp}
                layout
                exit={{ opacity: 0, scale: 0.93, y: 10 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 48px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.25 },
                }}
                className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl overflow-hidden group shadow-sm transition-all flex flex-col"
              >
                {/* Image Banner */}
                <div className="relative h-48 bg-stone-100 overflow-hidden shrink-0">
                  <motion.img
                    src={prod.image}
                    alt={prod.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      prod.stock === 0 ? "grayscale opacity-50" : "group-hover:scale-105"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-80" />

                  {/* Status Badge */}
                  <motion.span
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-2 shadow-lg backdrop-blur-sm ${
                      prod.status === "active"
                        ? "text-green-800 bg-green-50/95 border-green-300/60"
                        : "text-stone-600 bg-stone-100/95 border-stone-300/60"
                    }`}
                  >
                    {prod.status}
                  </motion.span>

                  {/* Stock Indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`absolute top-4 left-4 px-3 py-1.5 backdrop-blur-sm border text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1.5 ${
                      prod.stock > 10
                        ? "bg-white/95 border-white/60 text-stone-700"
                        : prod.stock > 0
                        ? "bg-amber-50/95 border-amber-200/60 text-amber-700"
                        : "bg-red-50/95 border-red-200/60 text-red-700"
                    }`}
                  >
                    <Layers size={12} />
                    {prod.stock === 0 ? "Out of Stock" : `${prod.stock} in stock`}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2">
                      <Tag size={12} />
                      {prod.category}
                    </div>
                    
                    <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-2 leading-snug mb-1">
                      {prod.name}
                    </h3>
                    
                    <p className="text-[10px] font-mono text-stone-400 mb-4 truncate">
                      {prod.sku}
                    </p>

                    <div className="flex items-center text-lg font-bold text-stone-800 mb-2">
                      <DollarSign size={16} className="text-stone-400 mr-0.5" />
                      {prod.price.toFixed(2)}
                    </div>
                  </motion.div>

                  {/* Action Buttons - appear on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 pt-4 border-t border-stone-100/80 opacity-0 group-hover:opacity-100 transition-opacity mt-auto"
                  >
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      whileHover={{ backgroundColor: "rgba(22, 101, 52, 0.08)" }}
                      onClick={() => navigate(`/seller/products/${prod.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-green-700 hover:text-green-800 border-2 border-green-200/60 hover:border-green-700 rounded-xl transition-all cursor-pointer bg-green-50/40"
                    >
                      <Edit2 size={13} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                      onClick={() => setDeleteId(prod.id)}
                      className="flex items-center justify-center p-2.5 text-xs font-bold text-red-500 hover:text-red-600 border-2 border-red-200/60 hover:border-red-500 rounded-xl transition-all cursor-pointer bg-red-50/40"
                    >
                      <Trash2 size={13} />
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
                className="mb-4 p-5 rounded-full bg-stone-100/60"
              >
                <Package size={40} className="opacity-40" />
              </motion.div>
              <p className="font-semibold text-stone-600 text-center mb-2 text-lg">
                No products found
              </p>
              <p className="text-sm text-stone-500 text-center mb-6 max-w-sm">
                {search
                  ? "We couldn't find any products matching your search. Try a different keyword."
                  : "Your catalog is currently empty. Add your first product to get started."}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/seller/products/new")}
                className="text-sm text-green-700 font-bold flex items-center gap-2 hover:text-green-900 cursor-pointer bg-green-50/60 px-5 py-2.5 rounded-xl border border-green-200/60 transition-all"
              >
                <Plus size={16} />
                Add First Product
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
                    Delete Product?
                  </h3>
                </div>
              </motion.div>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                This action cannot be undone. The product will be permanently removed from your catalog and storefront.
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

export default ProductList;