import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart, Eye, Store } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    name,
    price,
    originalPrice,
    rating,
    reviewsCount,
    image,
    category,
    vendorName,
    badgeText,
    badgeColor,
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    setShowAddedMessage(true);
    if (!isAuthenticated) {
      toast.error("Please login first");
    }
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="relative flex flex-col h-full bg-gradient-to-br from-[#fbfbfa] to-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-green-800/30 transition-all duration-300 group"
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

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2.5 pointer-events-auto">
        {badgeText && (
          <motion.span
            variants={badgeVariants}
            className={`px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white rounded-full shadow-lg backdrop-blur-sm ${
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
            className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg backdrop-blur-sm"
          >
            {discount}% OFF
          </motion.span>
        )}
      </div>

      <motion.button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white shadow-lg transition-all duration-300 cursor-pointer group/wish"
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
            size={18}
            className={`transition-all duration-300 ${
              isWishlisted ? "fill-red-500 text-red-500 drop-shadow-lg" : ""
            }`}
          />
        </motion.div>
      </motion.button>

      <div className="relative pt-[100%] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <motion.img
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0"
          animate={{
            background: isHovered
              ? "linear-gradient(to top, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0))"
              : "linear-gradient(to top, rgba(0,0,0,0), transparent, rgba(0,0,0,0))",
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white hover:bg-green-800 hover:text-white rounded-full flex items-center justify-center shadow-xl transition-all text-stone-700 cursor-pointer font-semibold group/btn"
            title="Quick View"
          >
            <motion.div animate={{ scale: isHovered ? 1.1 : 1 }}>
              <Eye size={20} />
            </motion.div>
          </motion.button>
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer font-semibold"
            title="Add to Cart"
          >
            <motion.div animate={{ scale: isHovered ? 1.1 : 1 }}>
              <ShoppingCart size={20} />
            </motion.div>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showAddedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-green-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm"
            >
              Added to cart! ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div className="p-5 flex flex-col flex-grow relative z-10">
        <motion.div
          className="flex items-center justify-between gap-2 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.span
            className="text-[10px] font-bold text-amber-800 tracking-wider uppercase bg-gradient-to-r from-amber-100 to-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50"
            whileHover={{ scale: 1.05 }}
          >
            {category}
          </motion.span>
          <motion.div
            className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-600 hover:text-green-800 transition-colors group/vendor cursor-pointer"
            whileHover={{ x: 2 }}
          >
            <Store size={11} className="shrink-0" />
            <span className="truncate max-w-[90px] group-hover/vendor:underline">
              {vendorName}
            </span>
          </motion.div>
        </motion.div>

        <motion.h3
          className="font-serif text-[15px] font-semibold text-stone-900 mb-2.5 leading-tight tracking-tight line-clamp-2 hover:text-green-800 transition-colors cursor-pointer relative"
          whileHover={{ x: 2 }}
        >
          {name}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-800 to-green-600 rounded-full"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.h3>

        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Star
                  size={12}
                  className={`transition-all ${
                    i < Math.floor(rating)
                      ? "fill-amber-500 text-amber-500"
                      : "text-stone-300"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <motion.span
            className="text-[11px] font-bold text-stone-600"
            whileHover={{ color: "#16a34a" }}
          >
            {rating}
          </motion.span>
          <motion.span
            className="text-[11px] text-stone-500"
            whileHover={{ color: "#16a34a" }}
          >
            ({reviewsCount})
          </motion.span>
        </motion.div>

        <motion.div
          className="mt-auto pt-4 border-t border-stone-200/80 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div className="flex flex-col" whileHover={{ x: 2 }}>
            {originalPrice && (
              <motion.span
                className="text-[12px] text-stone-400 line-through font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ${originalPrice.toFixed(2)}
              </motion.span>
            )}
            <motion.span
              className="text-lg font-bold text-green-900 tracking-tight font-serif"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              ${price.toFixed(2)}
            </motion.span>
          </motion.div>

          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 border-2 border-stone-800 hover:border-green-800 hover:bg-green-800 hover:text-white rounded-full text-[12px] font-bold text-stone-800 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-lg"
          >
            <motion.div
              animate={isHovered ? { x: [0, 3, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <ShoppingCart size={14} />
            </motion.div>
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </motion.div>

        {discount && discount > 20 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-center text-[10px] font-bold text-green-700 bg-green-50 py-1.5 rounded-lg"
          >
            ✓ Free Shipping Eligible
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
