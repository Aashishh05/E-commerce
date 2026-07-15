import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Upload, ArrowLeft, Check, ImageIcon } from "lucide-react";
import API from "../../utils/axios.js";

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

const schema = Yup.object({
  name: Yup.string().trim().required("Category name is required."),
  description: Yup.string().trim().required("Description is required."),
});

const CategoryForm = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState([]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formdata = new FormData();

      formdata.append("name", values.name);
      formdata.append("description", values.description);
      if (values.image) {
        formdata.append("image", values.image);
      }

      const res = await API.post(`/api/category/create`, formdata);
      console.log(res.data);

      setCategory((prev) => [...prev, res.data.data]);
      setSubmitted(true);
      setTimeout(() => navigate("/category-list"), 1600);
    } catch (error) {
      setError("Error creating category", error);
    } finally {
      setSubmitting(false);
    }
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
          className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-700 shadow-lg border border-green-200/60"
        >
          <Check size={40} strokeWidth={2.5} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            Category Created!
          </h2>
          <p className="text-stone-500 text-sm">
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
      className="max-w-xl space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/seller/categories")}
          className="p-2.5 rounded-2xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </motion.button>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-green-700">
            Category Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            New Category
          </h1>
        </div>
      </motion.div>

      <Formik
        initialValues={{ name: "", description: "", image: null }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-5">
            {/* Image Upload */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-sm"
            >
              <label className="text-xs font-bold uppercase tracking-widest text-stone-600 block mb-3">
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

                  const file = e.dataTransfer.files[0];

                  if (file) {
                    setFieldValue("image", file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                onClick={() => document.getElementById("cat-img").click()}
                className={`relative h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragOver
                    ? "border-green-700 bg-green-50 scale-105"
                    : imagePreview
                      ? "border-green-300 bg-green-50/30"
                      : "border-stone-300 hover:border-green-700 hover:bg-green-50/40"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80"
                    />

                    <div className="relative z-10 bg-white/95 px-4 py-1.5 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow border border-stone-200">
                      <ImageIcon size={13} />
                      Change Image
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="text-stone-300"
                    >
                      <Upload size={28} />
                    </motion.div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-stone-500">
                        Drag & drop or click to upload
                      </p>

                      <p className="text-xs text-stone-400 mt-0.5">
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
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      // Store file in Formik
                      setFieldValue("image", file);

                      // Preview image
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Name + Description */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-sm space-y-5"
            >
              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2 block">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Field name="name">
                  {({ field }) => (
                    <motion.input
                      {...field}
                      placeholder="e.g. Beauty & Skincare"
                      whileFocus={{ scale: 1.01 }}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 ${
                        touched.name && errors.name
                          ? "border-red-300 bg-red-50/50"
                          : "border-stone-200 bg-white hover:border-green-300"
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage name="name">
                  {(msg) => (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1.5 font-medium"
                    >
                      {msg}
                    </motion.p>
                  )}
                </ErrorMessage>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <Field name="description">
                  {({ field }) => (
                    <motion.textarea
                      {...field}
                      rows={4}
                      placeholder="Briefly describe what products belong in this category…"
                      whileFocus={{ scale: 1.01 }}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 resize-none ${
                        touched.description && errors.description
                          ? "border-red-300 bg-red-50/50"
                          : "border-stone-200 bg-white hover:border-green-300"
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage name="description">
                  {(msg) => (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1.5 font-medium"
                    >
                      {msg}
                    </motion.p>
                  )}
                </ErrorMessage>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 pt-2"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold rounded-2xl cursor-pointer shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                {isSubmitting ? "Adding Category..." : "Add Category"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate("/seller/categories")}
                whileHover={{ backgroundColor: "rgba(120,113,108,0.08)" }}
                className="px-6 py-3 border border-stone-200 text-stone-600 font-semibold rounded-2xl cursor-pointer transition-all text-sm"
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

export default CategoryForm;
