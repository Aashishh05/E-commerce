import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Check,
  X,
} from "lucide-react";

const INIT_CATEGORIES = [
  { id: 1, name: "Skincare",     slug: "skincare",     products: 4, active: true,  color: "#a78bfa" },
  { id: 2, name: "Aromatherapy", slug: "aromatherapy", products: 2, active: true,  color: "#f59e0b" },
  { id: 3, name: "Wellness",     slug: "wellness",     products: 3, active: true,  color: "#34d399" },
  { id: 4, name: "Body Care",    slug: "body-care",    products: 1, active: false, color: "#60a5fa" },
  { id: 5, name: "Hair Care",    slug: "hair-care",    products: 0, active: true,  color: "#f472b6" },
  { id: 6, name: "Supplements",  slug: "supplements",  products: 0, active: false, color: "#fb923c" },
];

const ACCENT_COLORS = [
  "#a78bfa", "#f59e0b", "#34d399", "#60a5fa",
  "#f472b6", "#fb923c", "#e879f9", "#2dd4bf",
];

const slugify = (str) =>
  str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const AdminCategories = () => {
  const [categories, setCategories] = useState(INIT_CATEGORIES);
  const [adding, setAdding]         = useState(false);
  const [newName, setNewName]       = useState("");
  const [newColor, setNewColor]     = useState(ACCENT_COLORS[0]);
  const [editId, setEditId]         = useState(null);
  const [editName, setEditName]     = useState("");

  /* ─ helpers ─ */
  const toggleActive = (id) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  const deleteCategory = (id) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  const addCategory = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const next = {
      id:       Date.now(),
      name:     trimmed,
      slug:     slugify(trimmed),
      products: 0,
      active:   true,
      color:    newColor,
    };
    setCategories((prev) => [next, ...prev]);
    setNewName("");
    setNewColor(ACCENT_COLORS[0]);
    setAdding(false);
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = (id) => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: trimmed, slug: slugify(trimmed) } : c
      )
    );
    setEditId(null);
  };

  const cancelEdit = () => setEditId(null);

  const counts = {
    total:   categories.length,
    active:  categories.filter((c) => c.active).length,
    empty:   categories.filter((c) => c.products === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Tag size={20} className="text-emerald-400" />
            Categories
          </h1>
          <p className="text-white/30 text-sm mt-1">
            Manage product categories · add, rename, toggle, or remove
          </p>
        </div>

        
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.38 }}
        className="flex flex-wrap gap-3"
      >
        {[
          { label: "Total",    val: counts.total,  accent: "text-white/50  border-white/10   bg-white/5"         },
          { label: "Active",   val: counts.active, accent: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
          { label: "Empty",    val: counts.empty,  accent: "text-amber-400 border-amber-500/20 bg-amber-500/10"  },
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

      {/* Add new category inline form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
                New Category
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Name input */}
                <input
                  type="text"
                  autoFocus
                  placeholder="Category name..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  className="bg-white/5 border border-white/10 text-white/80 text-sm rounded-xl px-4 py-2.5 flex-1 focus:outline-none focus:border-emerald-500/50 placeholder-white/20 transition-all"
                />

                {/* Slug preview */}
                <span className="text-white/25 text-xs font-mono hidden sm:block shrink-0">
                  /{slugify(newName) || "slug"}
                </span>

                {/* Color picker */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        newColor === c ? "scale-125 border-white/60" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>

                {/* Confirm / Cancel */}
                <div className="flex gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={addCategory}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-all"
                  >
                    <Check size={13} /> Add
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => { setAdding(false); setNewName(""); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs font-bold hover:text-white/60 transition-all"
                  >
                    <X size={13} /> Cancel
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={`rounded-2xl border bg-[#161B27] p-5 transition-all relative overflow-hidden group ${
                cat.active ? "border-white/8" : "border-white/5 opacity-50"
              }`}
            >
              {/* Color accent strip */}
              <div
                className="absolute top-0 left-0 w-full h-0.5 rounded-t-2xl"
                style={{ background: cat.color }}
              />

              {/* Subtle corner glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
                style={{ background: cat.color }}
              />

              {/* Top row: icon + name + status */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    background: `${cat.color}18`,
                    borderColor: `${cat.color}30`,
                  }}
                >
                  <Tag size={16} style={{ color: cat.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Edit mode */}
                  {editId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="bg-white/5 border border-white/15 text-white/80 text-sm rounded-lg px-2 py-1 flex-1 focus:outline-none focus:border-white/30 min-w-0"
                      />
                      <button onClick={() => saveEdit(cat.id)} className="text-emerald-400 hover:text-emerald-300">
                        <Check size={13} />
                      </button>
                      <button onClick={cancelEdit} className="text-white/30 hover:text-white/60">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-white/85 text-sm font-bold truncate">{cat.name}</p>
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-white/20 hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil size={11} />
                      </button>
                    </div>
                  )}
                  <p className="text-white/25 text-[10px] font-mono mt-0.5">/{cat.slug}</p>
                </div>

                {/* Active badge */}
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shrink-0 ${
                    cat.active
                      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                      : "text-white/25 border-white/10 bg-white/5"
                  }`}
                >
                  {cat.active ? "Active" : "Off"}
                </span>
              </div>

              {/* Product count bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/30 text-[10px]">Products</span>
                  <span className="text-white/50 text-[10px] font-mono font-bold">{cat.products}</span>
                </div>
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((cat.products / 10) * 100, 100)}%` }}
                    transition={{ duration: 0.7, delay: i * 0.06 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                {/* Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => toggleActive(cat.id)}
                  className={`flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                    cat.active
                      ? "bg-white/5 border-white/10 text-white/40 hover:text-white/60 hover:bg-white/8"
                      : "bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                  }`}
                >
                  {cat.active ? (
                    <><ToggleRight size={13} /> Deactivate</>
                  ) : (
                    <><ToggleLeft size={13} /> Activate</>
                  )}
                </motion.button>

                {/* Delete */}
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => deleteCategory(cat.id)}
                  title="Delete category"
                  disabled={cat.products > 0}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                    cat.products > 0
                      ? "opacity-20 cursor-not-allowed bg-white/5 border-white/8 text-white/30"
                      : "bg-red-500/10 border-red-500/15 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  <Trash2 size={13} />
                </motion.button>
              </div>

              {cat.products > 0 && (
                <p className="text-white/15 text-[9px] text-right mt-1.5">
                  Remove all products to delete
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminCategories;