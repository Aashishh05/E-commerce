import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Upload, ArrowLeft, Check, X, DollarSign, Package } from "lucide-react";
import API from "../../utils/axios";
import toast from "react-hot-toast";

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

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Product name is required."),
  description: Yup.string().trim().required("Description is required."),
  category: Yup.string(),
  price: Yup.number()
    .typeError("Valid price is required.")
    .positive("Valid price is required.")
    .required("Valid price is required."),
  originalPrice: Yup.number()
    .typeError("Original price must be a number.")
    .positive("Original price must be greater than 0.")
    .nullable()
    .notRequired(),
  stock: Yup.number()
    .typeError("Stock quantity is required.")
    .min(0, "Stock quantity is required.")
    .required("Stock quantity is required."),
  status: Yup.string().oneOf(["active", "draft", "archived"]),
  tags: Yup.string(),
  images: Yup.array().min(1, "At least one image required."),
});

const ProductForm = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await API.get(`/api/category/getall`);
      setCategories(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("description", values.description.trim());
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("status", values.status);

      if (values.originalPrice) {
        formData.append("originalPrice", values.originalPrice);
      }

      if (values.tags) {
        formData.append("tags", values.tags);
      }

      // IMPORTANT: Append images with field name "image" to match backend route upload.array("image", 5)
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      await API.post(`/api/product/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(formData)
      setSubmitted(true);
      toast.success("Product published successfully");
      setTimeout(() => navigate("/product-list"), 1000);
    } catch (error) {
      console.log(error);
      const msg =
        error?.response?.data?.message ||
        "Failed to create product. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageAdd = (files, setFieldValue, values) => {
    const incoming = Array.from(files);

    const validFiles = [];
    const validPreviews = [];

    for (const file of incoming) {
      if (values.images.length + validFiles.length >= MAX_IMAGES) break;

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        continue;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
        continue;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setFieldValue("images", [...values.images, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...validPreviews]);
    }
  };

  const removeImage = (index, setFieldValue, values) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = values.images.filter((_, i) => i !== index);
    setFieldValue("images", newImages);
    setImagePreviews(newPreviews);
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
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
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

      <Formik
        initialValues={{
          name: "",
          description: "",
          category: "",
          price: "",
          originalPrice: "",
          stock: "",
          status: "active",
          tags: "",
          images: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* ── Images Section ── */}
            <motion.div
              variants={fadeUp}
              className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl p-8 shadow-sm"
            >
              <label className="text-xs font-bold uppercase tracking-widest text-stone-600 block mb-4">
                Product Images <span className="text-red-500">*</span>
              </label>

              {imagePreviews.length > 0 && (
                <motion.div
                  variants={stagger}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
                >
                  {imagePreviews.map((preview, i) => (
                    <motion.div
                      key={preview}
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
                        onClick={() => removeImage(i, setFieldValue, values)}
                        className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {imagePreviews.length < MAX_IMAGES && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleImageAdd(e.dataTransfer.files, setFieldValue, values);
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
                      PNG, JPG, WEBP — max {MAX_SIZE_MB}MB each ({MAX_IMAGES}{" "}
                      images max)
                    </p>
                  </div>
                  <input
                    id="prod-images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageAdd(e.target.files, setFieldValue, values)
                    }
                  />
                </div>
              )}

              {touched.images && errors.images && (
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
                <Field name="name">
                  {({ field }) => (
                    <motion.input
                      {...field}
                      placeholder="e.g. Handcrafted Herbal Oils Set"
                      whileFocus={{ scale: 1.01 }}
                      className={`w-full px-5 py-3 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 ${
                        touched.name && errors.name
                          ? "border-red-300 bg-red-50/50"
                          : "border-stone-200/60 bg-white/50 hover:border-green-300"
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage name="name">
                  {(msg) => (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-2 font-medium"
                    >
                      {msg}
                    </motion.p>
                  )}
                </ErrorMessage>
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeUp}>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                  Description
                  <span className="text-red-500">*</span>
                </label>
                <Field name="description">
                  {({ field }) => (
                    <motion.textarea
                      {...field}
                      rows={4}
                      placeholder="Describe your product in detail. Include materials, benefits, usage..."
                      whileFocus={{ scale: 1.01 }}
                      className={`w-full px-5 py-3 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 resize-none ${
                        touched.description && errors.description
                          ? "border-red-300 bg-red-50/50"
                          : "border-stone-200/60 bg-white/50 hover:border-green-300"
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage name="description">
                  {(msg) => (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-2 font-medium"
                    >
                      {msg}
                    </motion.p>
                  )}
                </ErrorMessage>
              </motion.div>

              {/* Category */}
              <motion.div variants={fadeUp}>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                  Category
                </label>
                <Field name="category">
                  {({ field }) => (
                    <select
                      {...field}
                      disabled={loadingCategories}
                      className="w-full px-5 py-3 border border-stone-200/60 rounded-2xl text-sm font-medium bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all cursor-pointer disabled:opacity-60"
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories..."
                          : "Select Category"}
                      </option>
                      {categories.length > 0 &&
                        categories.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      {!loadingCategories && categories.length === 0 && (
                        <option disabled>No Categories Found</option>
                      )}
                    </select>
                  )}
                </Field>
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
                  <Field name="price">
                    {({ field }) => (
                      <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden bg-white/50 focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all">
                        <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm border-r border-stone-200/60 select-none">
                          $
                        </span>
                        <motion.input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          whileFocus={{ scale: 1.01 }}
                          className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent text-stone-800 placeholder-stone-400"
                        />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="price">
                    {(msg) => (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-2 font-medium"
                      >
                        {msg}
                      </motion.p>
                    )}
                  </ErrorMessage>
                </motion.div>

                {/* Original Price */}
                <motion.div variants={fadeUp}>
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                    Original Price
                    <span className="text-stone-400">(Optional)</span>
                  </label>
                  <Field name="originalPrice">
                    {({ field }) => (
                      <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden bg-white/50 focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all">
                        <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm border-r border-stone-200/60 select-none">
                          $
                        </span>
                        <motion.input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          whileFocus={{ scale: 1.01 }}
                          className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent text-stone-800 placeholder-stone-400"
                        />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="originalPrice">
                    {(msg) => (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-2 font-medium"
                      >
                        {msg}
                      </motion.p>
                    )}
                  </ErrorMessage>
                </motion.div>
              </div>

              {/* Stock */}
              <motion.div variants={fadeUp}>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                  Stock Quantity
                  <span className="text-red-500">*</span>
                </label>
                <Field name="stock">
                  {({ field }) => (
                    <div className="flex items-center border border-stone-200/60 rounded-2xl overflow-hidden bg-white/50 focus-within:border-green-800 focus-within:ring-2 focus-within:ring-green-800/20 transition-all">
                      <span className="px-5 py-3 bg-stone-100/60 text-stone-500 text-sm border-r border-stone-200/60 select-none">
                        <Package size={14} />
                      </span>
                      <motion.input
                        {...field}
                        type="number"
                        placeholder="0"
                        whileFocus={{ scale: 1.01 }}
                        className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent text-stone-800 placeholder-stone-400"
                      />
                      <span className="px-5 py-3 text-stone-500 text-sm font-medium">
                        units
                      </span>
                    </div>
                  )}
                </Field>
                <ErrorMessage name="stock">
                  {(msg) => (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-2 font-medium"
                    >
                      {msg}
                    </motion.p>
                  )}
                </ErrorMessage>
              </motion.div>

              {/* Tags */}
              <motion.div variants={fadeUp}>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2.5 block flex items-center gap-1.5">
                  Tags
                  <span className="text-stone-400">(Comma-separated)</span>
                </label>
                <Field name="tags">
                  {({ field }) => (
                    <motion.input
                      {...field}
                      placeholder="e.g. organic, eco-friendly, handmade"
                      whileFocus={{ scale: 1.01 }}
                      className="w-full px-5 py-3 border border-stone-200/60 rounded-2xl text-sm font-medium bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all"
                    />
                  )}
                </Field>
              </motion.div>
            </motion.div>


            {/* ── Action Buttons ── */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 pt-4"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 12px 32px rgba(22, 101, 52, 0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && (
                  <motion.div
                    className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
                {isSubmitting ? "Publishing..." : "Publish Product"}
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
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ProductForm;
