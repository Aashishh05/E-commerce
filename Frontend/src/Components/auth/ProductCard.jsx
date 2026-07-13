import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart, Eye, Store } from "lucide-react";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex flex-col h-full bg-[#fbfbfa] border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-green-800/30 transition-all duration-300 group"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {badgeText && (
          <span
            className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white rounded-full shadow-sm ${
              badgeColor === "green" ? "bg-green-700" : "bg-amber-600"
            }`}
          >
            {badgeText}
          </span>
        )}
        {discount && (
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white bg-red-600 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200/60 flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white shadow-sm transition-all duration-300 cursor-pointer"
        aria-label="Add to Wishlist"
      >
        <Heart
          size={16}
          className={`transition-transform duration-300 ${isWishlisted ? "fill-red-500 text-red-500 scale-110" : "hover:scale-110"}`}
        />
      </button>

      {/* Image Container */}
      <div className="relative pt-[100%] overflow-hidden bg-stone-100">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:opacity-95 transition-opacity"
        />

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white hover:bg-green-800 hover:text-white rounded-full flex items-center justify-center shadow-md transition-colors text-stone-700 cursor-pointer"
            title="Quick View"
          >
            <Eye size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white hover:bg-green-800 hover:text-white rounded-full flex items-center justify-center shadow-md transition-colors text-stone-700 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase bg-amber-50 px-2 py-0.5 rounded">
            {category}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-green-800 transition-colors">
            <Store size={10} className="shrink-0" />
            <span className="truncate max-w-[100px]">{vendorName}</span>
          </div>
        </div>

        <h3 className="font-serif text-[15px] font-semibold text-stone-900 mb-2 leading-tight tracking-tight line-clamp-2 hover:text-green-800 transition-colors cursor-pointer">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-stone-300"
                }
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            ({reviewsCount})
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-stone-200/50 flex items-center justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through font-medium">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base font-bold text-green-900 tracking-tight">
              ${price.toFixed(2)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-stone-800 hover:border-green-800 hover:bg-green-800 hover:text-white rounded-full text-xs font-bold text-stone-800 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
          >
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
