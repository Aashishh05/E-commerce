import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Check, Image as ImageIcon } from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* Auto-slugify */
const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const CategoryForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" ? { slug: toSlug(value) } : {}),
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: file, imagePreview: preview }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    // TODO: dispatch create/update action
    setSubmitted(true);
    setTimeout(() => navigate("/seller/categories"), 1600);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-700 shadow-lg border border-green-200/60"
        >
          <Check size={40} strokeWidth={2.5} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center"
        >
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            Category Created!
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Your new category has been saved. Redirecting...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="max-w-2xl space-y-8"
    >
      {/* ── Header ── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-4 mb-2"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/seller/categories")}
          className="p-2.5 rounded-2xl hover:bg-stone-100/70 text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </motion.button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              Category Management
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Create New Category
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Add a new product category to organize your store inventory
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Image Upload Section ── */}
        <motion.div
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-stone-600 block mb-4">
            Category Image
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleImageChange(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById("cat-img").click()}
            className={`relative h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragOver
                ? "border-green-800 bg-green-50 shadow-lg scale-105"
                : form.imagePreview
                ? "border-green-300/60 bg-green-50/30"
                : "border-stone-300 hover:border-green-800 hover:bg-green-50/50"
            }`}
          >
            {form.imagePreview ? (
              <>
                <img
                  src={form.imagePreview}
                  alt="preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80"
                />
                <motion.div className="relative z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-2 shadow-lg border border-stone-200/60">
                  <ImageIcon size={14} />
                  Change Image
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-stone-300"
                >
                  <Upload size={32} />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-600">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    PNG, JPG, WEBP — max 5MB
                  </p>
                </div>
              </>
            )}
            <input
              id="cat-img"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </div>
        </motion.div>

        {/* ── Form Fields ── */}
        <motion.div
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div className="pb-6 border-b border-stone-100/60">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Category Details
            </h2>
          </div>

          {/* Name Field */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Category Name
              <span className="text-red-500">*</span>
            </label>
            <motion.input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Beauty & Skincare"
              whileFocus={{ scale: 1.01 }}
              className={`w-full px-5 py-3 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 ${
                errors.name
                  ? "border-red-300 bg-red-50/50"
                  : "border-stone-200/60 bg-white/50 hover:border-green-300"
              }`}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 font-medium"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Slug Field */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              URL Slug
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all bg-white/50">
              <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm font-mono border-r border-stone-200/60 select-none shrink-0">
                /category/
              </span>
              <motion.input
                value={form.slug}
                onChange={(e) => handleChange("slug", toSlug(e.target.value))}
                placeholder="beauty-skincare"
                whileFocus={{ scale: 1.01 }}
                className="flex-1 px-5 py-3 text-sm font-mono outline-none bg-transparent text-stone-800 placeholder-stone-400"
              />
            </div>
            {errors.slug && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 font-medium"
              >
                {errors.slug}
              </motion.p>
            )}
          </motion.div>

          {/* Description Field */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Description
              <span className="text-red-500">*</span>
            </label>
            <motion.textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Briefly describe what products belong in this category…"
              whileFocus={{ scale: 1.01 }}
              className={`w-full px-5 py-3 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 resize-none ${
                errors.description
                  ? "border-red-300 bg-red-50/50"
                  : "border-stone-200/60 bg-white/50 hover:border-green-300"
              }`}
            />
            {errors.description && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 font-medium"
              >
                {errors.description}
              </motion.p>
            )}
          </motion.div>

          {/* Status Field */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-3 block">
              Status
            </label>
            <div className="flex gap-3">
              {["active", "inactive"].map((s) => (
                <motion.label
                  key={s}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-3 px-6 py-3 border-2 rounded-2xl cursor-pointer transition-all font-semibold capitalize text-sm ${
                    form.status === s
                      ? "border-green-800 bg-green-50/80 text-green-800 shadow-md"
                      : "border-stone-200/60 text-stone-600 hover:bg-stone-100/50 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => handleChange("status", s)}
                    className="hidden"
                  />
                  <motion.span
                    className={`w-2.5 h-2.5 rounded-full ${
                      form.status === s ? "bg-green-800" : "bg-stone-300"
                    }`}
                  />
                  {s}
                </motion.label>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 pt-4"
        >
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 12px 32px rgba(22, 101, 52, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-xl text-sm"
          >
            Save Category
          </motion.button>
          <motion.button
            type="button"
            onClick={() => navigate("/seller/categories")}
            whileHover={{ backgroundColor: "rgba(120, 113, 108, 0.1)" }}
            className="px-6 py-3 border border-stone-200/60 text-stone-600 font-semibold rounded-2xl hover:bg-stone-100/50 cursor-pointer transition-all text-sm"
          >
            Cancel
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CategoryForm;