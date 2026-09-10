import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ShoppingCart,
  Trash2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../Components/auth/Navbar";
import Footer from "../../Components/auth/Footer";
import ProductCard from "../../Components/auth/ProductCard";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import {
  setWishlistItems,
  setWishlistLoading,
  setWishlistError,
} from "../../Redux/wishlistSlice";

const WishlistPage = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      dispatch(setWishlistLoading(true));
      dispatch(setWishlistError(null));
      const res = await API.get("/api/wishlist/get");
      const data = res.data?.data;
      dispatch(setWishlistItems(data?.products || []));
    } catch (err) {
      if (!err._isHandled) {
        dispatch(
          setWishlistError(
            err.response?.data?.message || "Failed to load wishlist"
          )
        );
      }
    } finally {
      dispatch(setWishlistLoading(false));
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="mb-8"
        >
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-green-800 hover:text-green-700 font-semibold mb-6"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="font-serif text-5xl font-bold text-stone-900">
            My Wishlist
          </h1>
          <p className="text-stone-600 mt-2 text-base font-semibold">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <LoaderCircle size={40} className="text-green-800" />
            </motion.div>
            <p className="text-stone-600 font-medium">
              Loading your wishlist...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md"
            >
              <AlertCircle size={50} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-red-600 mb-2">
                Couldn't load wishlist
              </h2>
              <p className="text-stone-600 mb-6 text-sm">{error}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={fetchWishlist}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition text-sm"
              >
                Try Again
              </motion.button>
            </motion.div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[40vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <Heart
                  size={64}
                  className="mx-auto text-red-400 opacity-40"
                />
              </motion.div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-stone-600 mb-8">
                Tap the heart icon on products you love to save them here
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => nav("/")}
                className="px-8 py-3 bg-green-800 text-white font-bold rounded-full hover:bg-green-700 transition inline-flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart size={18} />
                Explore Products
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {items.map((product) => (
              <motion.div
                key={product._id}
                variants={slideUp}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;
