import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  ChevronLeft,
  Plus,
  Minus,
  Truck,
  Gift,
  Lock,
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/auth/Navbar";
import Footer from "../Components/auth/Footer";
import { useDispatch, useSelector } from "react-redux";
import API from "../utils/axios";
import {
  clearCart,
  removeItem,
  setCart,
  setError,
  setLoading,
} from "../Redux/cartSlice";

const CartPage = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchCartProducts = async () => {
    try {
      dispatch(setLoading(true));
      const res = await API.get(`/api/cart/get`);
      dispatch(setCart(res.data.data.items));
    } catch (error) {
      console.log(error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e8e8e8' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const discount = appliedCoupon
    ? (subtotal * (appliedCoupon.discountPercent || 0)) / 100
    : 0;
  const shipping = subtotal > 2500 ? 0 : 100;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + shipping + tax;

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setConfirmationType("deleteItem");
    setShowConfirmation(true);
  };

  const handleClearCartClick = () => {
    setConfirmationType("clearCart");
    setShowConfirmation(true);
  };

  const handleConfirmAction = () => {
    if (confirmationType === "deleteItem") {
      dispatch(removeItem(itemToDelete._id));
    } else if (confirmationType === "clearCart") {
      dispatch(clearCart());
    }
    setShowConfirmation(false);
    setItemToDelete(null)
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
            <ChevronLeft size={20} /> Continue Shopping
          </button>
          <h1 className="font-serif text-5xl font-bold text-stone-900">
            Your Cart
          </h1>
          <p className="text-stone-600 mt-2 text-base font-semibold">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center min-h-[50vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <ShoppingBag
                  size={64}
                  className="mx-auto text-green-800 opacity-40"
                />
              </motion.div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-stone-600 mb-8">
                Explore our marketplace and add some beautiful items
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => nav("/")}
                className="px-8 py-3 bg-green-800 text-white font-bold rounded-full hover:bg-green-700 transition inline-flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={18} />
                Start Shopping
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.3, delay: idx * 0.05 },
                      },
                    }}
                    className="bg-white rounded-xl border border-stone-200 p-4 md:p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-4 md:gap-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                        <img
                          src={item.image?.url || placeholder}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = placeholder;
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-semibold text-stone-900 text-sm md:text-base truncate">
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-sm text-stone-600 mb-1">Price</p>
                            <p className="font-bold text-green-800 text-base md:text-lg">
                              Rs.{item.price?.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full px-2 py-1">
                            <button className="p-1 hover:bg-stone-200 rounded-full transition cursor-pointer">
                              <Minus size={14} className="text-stone-700" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                            <button className="p-1 hover:bg-stone-200 rounded-full transition cursor-pointer">
                              <Plus size={14} className="text-stone-700" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <p className="text-xs text-stone-600 mb-1">
                            Subtotal
                          </p>
                          <p className="font-bold text-stone-900">
                            Rs.
                            {(item.price * item.quantity)?.toFixed(2)}
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearCartClick}
                    className="flex items-center gap-2 justify-center rounded-xl bg-red-500/20 text-red-700 font-semibold px-5 py-3 hover:bg-red-500/30 transition cursor-pointer"
                  >
                    <Trash2 size={18} />
                    Clear Cart
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm sticky top-8">
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-stone-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-semibold">
                      Rs.{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-700 bg-green-50 -mx-6 -mb-4 px-6 py-3 rounded-b-lg">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span className="font-semibold">
                        -Rs.{discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      Shipping{" "}
                      {shipping === 0 && (
                        <span className="text-green-700 font-semibold">
                          (Free)
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">
                      {shipping === 0 ? "Free" : `Rs.${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Tax (10%)</span>
                    <span className="font-semibold">Rs.{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-stone-900 mb-6">
                  <span>Total</span>
                  <span className="text-green-800">Rs.{total.toFixed(2)}</span>
                </div>

                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift size={16} className="text-amber-700" />
                        <div>
                          <p className="text-xs text-amber-700 font-semibold">
                            Coupon Applied
                          </p>
                          <p className="text-sm font-bold text-amber-900">
                            {appliedCoupon.code}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setAppliedCoupon(null)}
                        className="text-xs text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                      >
                        Remove
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-amber-900 block">
                        Have a coupon code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                          onKeyPress={(e) => {
                            // TODO: Call applyCoupon() on Enter key
                          }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 py-2 bg-amber-700 text-white text-xs font-bold rounded-lg hover:bg-amber-800 transition cursor-pointer"
                        >
                          Apply
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-t border-stone-200 pt-6">
                  <div className="flex gap-3 text-xs">
                    <Truck size={16} className="text-green-800 flex-shrink-0" />
                    <span className="text-stone-600">
                      Free shipping on orders over Rs.2500
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <Lock size={16} className="text-green-800 flex-shrink-0" />
                    <span className="text-stone-600">
                      Secure checkout with SSL encryption
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => nav("/")}
                  className="w-full py-3 mt-3 border-2 border-stone-300 text-stone-800 font-bold rounded-lg hover:bg-stone-50 transition text-base cursor-pointer"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <Trash2 size={28} className="text-red-600" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-stone-900 text-center">
                {confirmationType === "clearCart"
                  ? "Clear cart?"
                  : "Remove item?"}
              </h2>

              {/* Description */}
              <p className="mt-3 text-center text-sm leading-relaxed text-stone-600">
                {confirmationType === "clearCart"
                  ? "Are you sure you want to remove all items from your cart?"
                  : `Are you sure you want to remove "${itemToDelete?.name}" from your cart?`}
              </p>

              {/* Buttons */}
              <div className="mt-7 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConfirmation(false)}
                  className="
              flex-1
              rounded-xl
              border
              border-stone-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-stone-700
              transition
              hover:bg-stone-100
              flex
              items-center
              justify-center
              gap-2
            "
                >
                  <X size={17} />
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmAction}
                  className="
              flex-1
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-700
              flex
              items-center
              justify-center
              gap-2
            "
                >
                  <Trash2 size={17} />

                  {confirmationType === "clearCart" ? "Clear Cart" : "Remove"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CartPage;
