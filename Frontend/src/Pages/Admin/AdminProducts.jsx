import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

const INIT_PRODUCTS = [
  { id: 1,  name: "Botanical Face Serum",       category: "Skincare",      price: 34.99, stock: 42, seller: "Bloom & Co.",      active: true,  image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=56&h=56&fit=crop" },
  { id: 2,  name: "Soy Wax Candles (Set of 3)", category: "Aromatherapy",  price: 22.99, stock: 88, seller: "Earth & Sage",      active: true,  image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=56&h=56&fit=crop" },
  { id: 3,  name: "Handcrafted Herbal Oils",    category: "Wellness",      price: 19.99, stock: 15, seller: "Purely Botanical",  active: true,  image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=56&h=56&fit=crop" },
  { id: 4,  name: "Lavender Facial Mist",       category: "Skincare",      price: 14.50, stock: 60, seller: "Bloom & Co.",      active: false, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=56&h=56&fit=crop" },
  { id: 5,  name: "Rose Hip Night Cream",       category: "Skincare",      price: 42.00, stock: 29, seller: "Earth & Sage",      active: true,  image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=56&h=56&fit=crop" },
  { id: 6,  name: "Cedar & Clove Reed Diffuser",category: "Aromatherapy",  price: 28.00, stock: 0,  seller: "Purely Botanical",  active: false, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=56&h=56&fit=crop" },
  { id: 7,  name: "Green Tea Exfoliant Scrub",  category: "Skincare",      price: 18.00, stock: 34, seller: "Earth & Sage",      active: true,  image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=56&h=56&fit=crop" },
  { id: 8,  name: "Chamomile Sleep Balm",       category: "Wellness",      price: 16.50, stock: 51, seller: "Bloom & Co.",      active: true,  image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=56&h=56&fit=crop" },
  { id: 9,  name: "Eucalyptus Bath Salts",      category: "Wellness",      price: 12.99, stock: 72, seller: "Purely Botanical",  active: true,  image: "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=56&h=56&fit=crop" },
  { id: 10, name: "Ylang Ylang Body Oil",       category: "Body Care",     price: 24.00, stock: 11, seller: "Earth & Sage",      active: false, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=56&h=56&fit=crop" },
];

const CATEGORIES = ["All", "Skincare", "Aromatherapy", "Wellness", "Body Care"];

const AdminProducts = () => {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [statusF, setStatusF]   = useState("All"); // All / Active / Inactive

  const toggleActive = (id) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const filtered = products.filter((p) => {
    const matchCat    = filter === "All" || p.category === filter;
    const matchStatus =
      statusF === "All" ||
      (statusF === "Active" && p.active) ||
      (statusF === "Inactive" && !p.active);
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const counts = {
    total:    products.length,
    active:   products.filter((p) => p.active).length,
    inactive: products.filter((p) => !p.active).length,
    outStock: products.filter((p) => p.stock === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-white text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <ShoppingBag size={20} className="text-purple-400" />
          Product Catalog
        </h1>
        <p className="text-white/30 text-sm mt-1">
          View, activate, deactivate, or remove products across all sellers
        </p>
      </motion.div>

      {/* Summary pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.38 }}
        className="flex flex-wrap gap-3"
      >
        {[
          { label: "Total",     val: counts.total,    accent: "text-white/50 border-white/10 bg-white/5" },
          { label: "Active",    val: counts.active,   accent: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
          { label: "Inactive",  val: counts.inactive, accent: "text-red-400 border-red-500/15 bg-red-500/10" },
          { label: "Out of Stock", val: counts.outStock, accent: "text-amber-400 border-amber-500/20 bg-amber-500/10" },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${s.accent}`}
          >
            <span className="text-[15px] font-bold font-mono">{s.val}</span>
            <span className="opacity-70">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Filters row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.38 }}
        className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3"
      >
        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-white/25 shrink-0" />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filter === c
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : "bg-white/5 text-white/35 border-white/8 hover:text-white/60 hover:bg-white/8"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 sm:ml-2">
          {["All", "Active", "Inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusF(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                statusF === s
                  ? "bg-white/12 text-white/80 border-white/20"
                  : "bg-white/5 text-white/30 border-white/8 hover:text-white/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products or sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/8 text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-56 focus:outline-none focus:border-purple-500/40 placeholder-white/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="rounded-2xl border border-white/8 bg-[#161B27] overflow-hidden"
      >
        {/* Table head */}
        <div className="grid grid-cols-[2fr_1fr_1fr_80px_90px_110px] items-center px-5 py-3 border-b border-white/8 text-[10px] font-black uppercase tracking-widest text-white/25">
          <span>Product</span>
          <span className="hidden lg:block">Seller</span>
          <span className="hidden md:block">Category</span>
          <span className="text-center">Stock</span>
          <span className="text-right">Price</span>
          <span className="text-right">Actions</span>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center text-white/20 text-sm"
            >
              No products match your filters.
            </motion.div>
          ) : (
            filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, delay: i * 0.035 }}
                className={`grid grid-cols-[2fr_1fr_1fr_80px_90px_110px] items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
                  !product.active ? "opacity-50" : ""
                }`}
              >
                {/* Product */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/8 shrink-0 bg-white/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 text-xs font-semibold truncate">{product.name}</p>
                    <p className="text-white/25 text-[10px] lg:hidden truncate">{product.seller}</p>
                    <p className="text-white/25 text-[10px] md:hidden">{product.category}</p>
                  </div>
                </div>

                {/* Seller */}
                <p className="text-white/35 text-xs truncate hidden lg:block pr-4">{product.seller}</p>

                {/* Category */}
                <div className="hidden md:block">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/15 text-purple-400 text-[10px] font-semibold">
                    {product.category}
                  </span>
                </div>

                {/* Stock */}
                <p
                  className={`text-xs font-mono text-center ${
                    product.stock === 0 ? "text-red-400" : "text-white/50"
                  }`}
                >
                  {product.stock === 0 ? "Out" : product.stock}
                </p>

                {/* Price */}
                <p className="text-white/70 text-xs font-mono font-bold text-right">
                  ${product.price.toFixed(2)}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5">
                  {/* Toggle active */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleActive(product.id)}
                    title={product.active ? "Deactivate" : "Activate"}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                      product.active
                        ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-white/5 border-white/10 text-white/30 hover:text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {product.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  </motion.button>

                  {/* Delete */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => deleteProduct(product.id)}
                    title="Delete product"
                    className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
                  >
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminProducts;