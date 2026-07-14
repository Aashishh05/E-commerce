import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Store,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Fashion & Apparel",
    "Beauty & Personal Care",
    "Home & Living Decor",
    "Electronics & Gadgets",
    "Wellness & Fitness",
    "Handcrafted Artisanal",
    "Gifts & Sets",
  ];

  const navItems = [
    "New Arrivals",
    "Featured Vendors",
    "Flash Deals",
    "Top Rated",
    "Voucher Center",
  ];

  return (
    <header
      className={`w-full z-50 sticky top-0 transition-all duration-300 ${
        scrolled
          ? "bg-stone-50/95 backdrop-blur-md shadow-lg border-b border-stone-200/80"
          : "bg-stone-50/95 backdrop-blur-md border-b border-stone-200/40"
      }`}
    >
      {/* Top Announcement Bar */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-stone-100 py-2.5 px-6 text-xs font-medium tracking-wide"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <motion.p
            className="hidden md:block flex-1 text-center"
            whileHover={{ letterSpacing: "0.05em" }}
            transition={{ duration: 0.3 }}
          >
            🎁 Free shipping on orders over $75. Code: AURA20
          </motion.p>
          <p className="mx-auto md:mx-0 flex items-center gap-2">
            <Zap size={12} className="animate-pulse" />
            <span>Explore 500+ independent global sellers</span>
          </p>
          <motion.a
            href="#sell"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex items-center gap-1.5 text-green-300 hover:text-white transition-colors font-semibold"
          >
            <Store size={12} />
            <span>Sell on Aura</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            whileHover={{ rotate: 20, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Leaf size={28} className="text-green-800" />
          </motion.div>
          <div className="relative">
            <h1 className="text-2xl font-serif font-bold text-green-900 tracking-tight leading-none">
              AURA
            </h1>
            <motion.p
              className="text-[9px] font-bold text-stone-500 tracking-[0.25em] mt-0.5 uppercase absolute top-full left-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Marketplace
            </motion.p>
          </div>
        </motion.a>

        {/* Search Bar */}
        <motion.div
          className="hidden md:flex flex-1 max-w-xl relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="w-full flex items-center bg-stone-100 border border-stone-200 rounded-full focus-within:ring-2 focus-within:ring-green-800/20 focus-within:border-green-800 transition-all shadow-sm hover:shadow-md overflow-hidden group">
            <Search
              className="absolute left-5 text-stone-400 group-focus-within:text-green-800 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products, brands, or vendors..."
              className="w-full pl-12 pr-5 py-2.5 text-sm bg-transparent border-none outline-none text-stone-800 placeholder-stone-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-900 hover:from-green-900 hover:to-green-950 text-white rounded-r-full transition-all font-semibold flex items-center justify-center cursor-pointer"
            >
              <Search size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Desktop Controls */}
        <motion.div
          className="hidden lg:flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.a
            href="#wishlist"
            className="relative p-2.5 text-stone-700 hover:text-green-800 transition-colors group"
            whileHover={{ y: -2 }}
          >
            <div className="relative">
              <Heart size={20} className="group-hover:fill-red-400" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gradient-to-br from-red-500 to-red-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-md"
              >
                3
              </motion.span>
            </div>
          </motion.a>

          <motion.a
            href="#cart"
            className="relative p-2.5 text-stone-700 hover:text-amber-600 transition-colors group"
            whileHover={{ y: -2 }}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gradient-to-br from-amber-500 to-amber-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-md"
              >
                2
              </motion.span>
            </div>
          </motion.a>

          <motion.a
            onClick={() => nav("/login")}
            className="flex items-center gap-2 py-2 px-5 bg-gradient-to-r from-green-50 to-green-100/80 border border-green-200/50 hover:from-green-100 hover:to-green-200 text-green-900 font-semibold rounded-full text-sm transition-all shadow-sm hover:shadow-md group"
            whileHover={{ x: 2 }}
          >
            <User
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span>Sign In</span>
          </motion.a>
        </motion.div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 text-stone-700 md:hidden hover:bg-stone-100 rounded-full transition-colors"
          >
            <Search size={20} />
          </motion.button>
          <motion.a
            href="#cart"
            className="relative p-2 text-stone-700 hover:text-amber-600 transition-colors"
            whileHover={{ y: -2 }}
          >
            <ShoppingCart size={20} />
            <motion.span className="absolute top-0 right-0 w-4 h-4 bg-amber-600 text-[9px] text-white font-bold rounded-full flex items-center justify-center">
              2
            </motion.span>
          </motion.a>
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:block border-t border-stone-200/60 bg-stone-50/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative">
              <motion.button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-green-900 hover:text-green-700 transition-colors group"
                whileHover={{ x: 2 }}
              >
                <span>Shop Categories</span>
                <motion.div
                  animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoriesOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-20 py-2 backdrop-blur-xl"
                    >
                      {categories.map((cat, idx) => (
                        <motion.a
                          key={cat}
                          href={`#category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{
                            x: 8,
                            backgroundColor: "rgba(6, 78, 59, 0.05)",
                          }}
                          className="block px-5 py-3 text-sm text-stone-700 hover:text-green-900 transition-colors font-medium"
                        >
                          {cat}
                        </motion.a>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-8 border-l border-stone-200/50 pl-8">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  whileHover={{ color: "#166534", y: -1 }}
                  className="text-sm font-medium text-stone-600 hover:text-green-800 transition-colors relative group"
                >
                  {item}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-800 to-green-600 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="w-2.5 h-2.5 rounded-full bg-amber-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              AURA OFFICIAL STORE
            </span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden w-full bg-white border-t border-stone-200 overflow-hidden shadow-xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-6 py-6 space-y-6"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex md:hidden items-center bg-stone-100 border border-stone-200 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-800/20"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full text-sm bg-transparent outline-none border-none text-stone-800 placeholder-stone-400"
                />
                <Search size={16} className="text-stone-400" />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xs font-bold uppercase text-stone-400 tracking-widest mb-4">
                  Shop Categories
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat, idx) => (
                    <motion.a
                      key={cat}
                      href={`#category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                      whileHover={{
                        backgroundColor: "rgba(6, 78, 59, 0.08)",
                        y: -2,
                      }}
                      className="px-3 py-2.5 text-sm bg-stone-50 rounded-lg text-stone-700 hover:text-green-950 transition-all font-medium"
                    >
                      {cat}
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="border-t border-stone-100 pt-6 space-y-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  "Featured Vendors",
                  "Flash Deals",
                  "Sell on Aura",
                  "Voucher Center",
                  "Customer Care",
                ].map((item, idx) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.05 }}
                    whileHover={{ x: 4, color: "#166534" }}
                    className="block text-sm font-medium text-stone-700 hover:text-green-800 transition-all"
                  >
                    {item}
                  </motion.a>
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <motion.a
                  href="#account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white rounded-xl text-center font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <User size={18} />
                  <span>My Account / Sign In</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
