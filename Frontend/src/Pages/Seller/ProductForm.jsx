import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  ArrowLeft,
  Check,
  Image as ImageIcon,
  X,
  Plus,
  DollarSign,
  Package,
  Tag,
} from "lucide-react";
import API from "../../utils/axios";

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

const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const ProductForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    status: "active",
    images: [],
    imagePreviews: [],
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/category/getall`);
      console.log(res.data.data);
      setCategory(res.data.data);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" ? { sku: toSlug(value) } : {}),
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageAdd = (files) => {
    Array.from(files).forEach((file) => {
      const preview = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, file],
        imagePreviews: [...prev.imagePreviews, preview],
      }));
    });
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.price || parseFloat(form.price) <= 0)
      e.price = "Valid price is required.";
    if (!form.stock || parseInt(form.stock) < 0)
      e.stock = "Stock quantity is required.";
    if (form.imagePreviews.length === 0)
      e.images = "At least one image required.";
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
    setTimeout(() => navigate("/seller/products"), 1600);
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
            Product Published!
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Your product is now live. Redirecting...
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
      className="max-w-4xl space-y-8"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 mb-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/seller/products")}
          className="p-2.5 rounded-2xl hover:bg-stone-100/70 text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </motion.button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              Product Management
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Create New Product
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Add a new product to your catalog
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Images Section ── */}
        <motion.div
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-stone-600 block mb-4">
            Product Images
          </label>

          {/* Image Gallery */}
          {form.imagePreviews.length > 0 && (
            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
            >
              {form.imagePreviews.map((preview, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative group"
                >
                  <motion.img
                    src={preview}
                    alt={`Product ${i + 1}`}
                    className="w-full h-24 object-cover rounded-2xl border border-stone-200/60"
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(i)}
                    className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleImageAdd(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById("prod-images").click()}
            className={`relative h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragOver
                ? "border-green-800 bg-green-50 shadow-lg scale-105"
                : "border-stone-300 hover:border-green-800 hover:bg-green-50/50"
            }`}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-stone-300"
            >
              <Upload size={32} />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold text-stone-600">
                Drag images or click to upload
              </p>
              <p className="text-xs text-stone-400 mt-1">
                PNG, JPG, WEBP — max 5MB each (5 images max)
              </p>
            </div>
            <input
              id="prod-images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageAdd(e.target.files)}
            />
          </div>

          {errors.images && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-3 font-medium"
            >
              {errors.images}
            </motion.p>
          )}
        </motion.div>

        {/* ── Product Details Section ── */}
        <motion.div
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div className="pb-6 border-b border-stone-100/60">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Product Details
            </h2>
          </div>
          {/* Product Name */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Product Name
              <span className="text-red-500">*</span>
            </label>
            <motion.input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Handcrafted Herbal Oils Set"
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
          {/* SKU */}
         
          {/* Description */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Description
              <span className="text-red-500">*</span>
            </label>
            <motion.textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your product in detail. Include materials, benefits, usage..."
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
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-5 py-3 border border-stone-200/60 rounded-2xl text-sm font-medium bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all cursor-pointer"
            >
              <option value="">Select Category</option>

              {category.length > 0 ? (
                category.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option disabled>No Categories Found</option>
              )}
            </select>
          </motion.div>
        </motion.div>

        {/* ── Pricing Section ── */}
        <motion.div
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div className="pb-6 border-b border-stone-100/60">
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-700" size={18} />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Pricing & Inventory
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <motion.div variants={fadeUp}>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                Sale Price
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden bg-white/50 focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all">
                <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm border-r border-stone-200/60 select-none">
                  $
                </span>
                <motion.input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0.00"
                  whileFocus={{ scale: 1.01 }}
                  className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent text-stone-800 placeholder-stone-400"
                />
              </div>
              {errors.price && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-2 font-medium"
                >
                  {errors.price}
                </motion.p>
              )}
            </motion.div>

            {/* Original Price */}
            <motion.div variants={fadeUp}>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                Original Price
                <span className="text-stone-400">(Optional)</span>
              </label>
              <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden bg-white/50 focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all">
                <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm border-r border-stone-200/60 select-none">
                  $
                </span>
                <motion.input
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) =>
                    handleChange("originalPrice", e.target.value)
                  }
                  placeholder="0.00"
                  whileFocus={{ scale: 1.01 }}
                  className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent text-stone-800 placeholder-stone-400"
                />
              </div>
            </motion.div>
          </div>

          {/* Stock */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Stock Quantity
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden bg-white/50 focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all">
              <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm border-r border-stone-200/60 select-none">
                <Package size={14} />
              </span>
              <motion.input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                placeholder="0"
                whileFocus={{ scale: 1.01 }}
                className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent text-stone-800 placeholder-stone-400"
              />
              <span className="px-5 py-3 text-stone-500 text-sm font-medium">
                units
              </span>
            </div>
            {errors.stock && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 font-medium"
              >
                {errors.stock}
              </motion.p>
            )}
          </motion.div>

          {/* Tags */}
          <motion.div variants={fadeUp}>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
              Tags
              <span className="text-stone-400">(Comma-separated)</span>
            </label>
            <motion.input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="e.g. organic, eco-friendly, handmade"
              whileFocus={{ scale: 1.01 }}
              className="w-full px-5 py-3 border border-stone-200/60 rounded-2xl text-sm font-medium bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all"
            />
          </motion.div>
        </motion.div>

        {/* ── Status Section ── */}
        <motion.div
          variants={fadeUp}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm"
        >
          <h2 className="font-serif text-lg font-bold text-stone-900 mb-6">
            Status
          </h2>
          <div className="flex gap-3">
            {["active", "draft", "archived"].map((s) => (
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

        {/* ── Action Buttons ── */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 pt-4">
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 12px 32px rgba(22, 101, 52, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-xl text-sm"
          >
            Publish Product
          </motion.button>
          <motion.button
            type="button"
            onClick={() => navigate("/seller/products")}
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

export default ProductForm;
