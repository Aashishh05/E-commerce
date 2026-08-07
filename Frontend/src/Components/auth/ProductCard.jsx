import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  ShoppingCart,
  Store,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";
import { setCart } from "../../Redux/cartSlice";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const {
    name,
    price,
    originalPrice,
    averageRating,
    numReviews,
    images,
    category,
    badgeText,
    badgeColor,
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await API.post("/api/cart/add", {
        product: product._id,
        quantity: 1,
      });

      dispatch(setCart(res.data.data.items));

      setShowAddedMessage(true);
      toast.success("Added to cart!");
      setTimeout(() => setShowAddedMessage(false), 2000);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button")) {
      return;
    }
    nav(`/productdetails/${product._id}`);
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8, x: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="relative aspect-square bg-gradient-to-br from-[#fbfbfa] to-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-green-800/30 transition-all duration-300 group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-900/0 to-green-800/0 pointer-events-none z-0"
        animate={{
          background: isHovered
            ? "radial-gradient(circle at 50% 50%, rgba(6, 78, 59, 0.05) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(6, 78, 59, 0) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
        {badgeText && (
          <motion.span
            variants={badgeVariants}
            className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white rounded-full shadow-lg backdrop-blur-sm ${
              badgeColor === "green"
                ? "bg-gradient-to-r from-green-700 to-green-800"
                : "bg-gradient-to-r from-amber-600 to-amber-700"
            }`}
          >
            {badgeText}
          </motion.span>
        )}
        {discount && (
          <motion.span
            variants={badgeVariants}
            transition={{ delay: 0.1 }}
            className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg backdrop-blur-sm"
          >
            {discount}% OFF
          </motion.span>
        )}
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            scale: isWishlisted ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isWishlisted ? "fill-red-500 text-red-500 drop-shadow-lg" : ""
            }`}
          />
        </motion.div>
      </motion.button>

      <div className="relative w-full h-1/2 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <motion.img
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={images?.[0]?.url}
          alt={name}
          className="w-full h-full object-cover"
        />

        <AnimatePresence>
          {showAddedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-green-600 text-white px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-lg"
            >
              Added! ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div className="p-3.5 h-1/2 flex flex-col relative z-10 bg-gradient-to-b from-[#fbfbfa] to-stone-50">
        <motion.div
          className="flex items-center justify-between gap-1.5 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.span className="text-[8px] font-bold text-amber-800 tracking-wider uppercase bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/50 whitespace-nowrap">
            {category?.name}
          </motion.span>
          <motion.div className="flex items-center gap-0.5 text-[8px] font-semibold text-stone-600 truncate group/vendor">
            <Store size={9} className="shrink-0" />
            <span
              className="truncate max-w-[60px]"
              title={product?.seller?.shopName}
            >
              {product?.seller?.shopName}
            </span>
          </motion.div>
        </motion.div>

        <motion.h3
          className="font-serif text-[13px] font-semibold text-stone-900 mb-1.5 leading-tight line-clamp-2 hover:text-green-800 transition-colors"
          whileHover={{ x: 1 }}
        >
          {name}
        </motion.h3>

        <motion.div
          className="flex items-center gap-1 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={`transition-all ${
                  i < Math.floor(averageRating || 0)
                    ? "fill-amber-500 text-amber-500"
                    : "text-stone-300"
                }`}
              />
            ))}
          </div>
          <motion.span className="text-[9px] font-bold text-stone-600">
            {averageRating || 0}
          </motion.span>
          <motion.span className="text-[8px] text-stone-500">
            ({numReviews || 0})
          </motion.span>
        </motion.div>

        <motion.div
          className="mt-auto pt-2 border-t border-stone-200/80 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <motion.div className="flex flex-col">
            {originalPrice && (
              <motion.span className="text-[9px] text-stone-400 line-through font-medium">
                Rs.{originalPrice.toFixed(0)}
              </motion.span>
            )}

            <motion.span className="text-base font-bold text-green-900 font-serif">
              Rs.{price.toFixed(0)}
            </motion.span>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 mr-3 border-2 border-stone-800 hover:border-green-800 hover:bg-green-800 hover:text-white rounded-full text-[10px] font-bold text-stone-800 transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <ShoppingCart size={12} />
              <span className="hidden sm:inline">Add</span>
            </motion.button>

            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-green-800"
            >
              <ChevronRight size={16} />
            </motion.div>
          </div>
        </motion.div>
        {discount && discount > 20 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-center text-[8px] font-bold text-green-700 bg-green-50 py-1 rounded"
          >
            ✓ Free Shipping
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
