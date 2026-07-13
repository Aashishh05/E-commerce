import React, { useState } from "react";
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
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = [
    "Fashion & Apparel",
    "Beauty & Personal Care",
    "Home & Living Decor",
    "Electronics & Gadgets",
    "Wellness & Fitness",
    "Handcrafted Artisanal",
    "Gifts & Sets",
  ];

  return (
    <header className="w-full z-50 sticky top-0 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80">
      {/* Top Announcement Bar */}
      <div className="w-full bg-green-900 text-stone-100 py-2 px-6 text-xs font-medium tracking-wide flex justify-between items-center">
        <p className="hidden md:block">
          Free shipping on orders over $75. Code: AURA20
        </p>
        <p className="mx-auto md:mx-0">
          Explore products from 500+ independent global sellers
        </p>
        <a
          href="#sell"
          className="hidden md:flex items-center gap-1.5 text-green-300 hover:text-white transition-colors"
        >
          <Store size={12} />
          <span>Sell on Aura</span>
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Leaf size={28} className="text-green-800" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-green-900 tracking-tight leading-none">
              AURA
            </h1>
            <p className="text-[9px] font-bold text-stone-500 tracking-[0.25em] mt-0.5 uppercase">
              Marketplace
            </p>
          </div>
        </a>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className="w-full flex items-center bg-stone-100 border border-stone-200 rounded-full focus-within:ring-2 focus-within:ring-green-800/20 focus-within:border-green-800 transition-all overflow-hidden">
            <input
              type="text"
              placeholder="Search products, brands, or local vendors..."
              className="w-full px-5 py-2 text-sm bg-transparent border-none outline-none text-stone-800 placeholder-stone-400"
            />
            <button className="p-2.5 px-5 bg-green-800 hover:bg-green-950 text-white rounded-r-full transition-colors flex items-center justify-center cursor-pointer">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href="#wishlist"
            className="relative p-2 text-stone-700 hover:text-green-800 transition-colors"
          >
            <Heart size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-800 text-[10px] text-white font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </a>
          <a
            href="#cart"
            className="relative p-2 text-stone-700 hover:text-green-800 transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </a>
          <a
            href="#account"
            className="flex items-center gap-2 py-1.5 px-4 bg-green-50/80 border border-green-200/50 hover:bg-green-100/80 text-green-900 font-medium rounded-full text-sm transition-colors"
          >
            <User size={16} />
            <span>Sign In</span>
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <button className="p-2 text-stone-700">
            <Search size={20} className="md:hidden" />
          </button>
          <a href="#cart" className="relative p-2 text-stone-700">
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-amber-600 text-[9px] text-white font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <nav className="hidden lg:block border-t border-stone-200/60 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-green-900 hover:text-green-700 transition-colors cursor-pointer"
              >
                <span>Shop Categories</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoriesOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-20 py-2"
                    >
                      {categories.map((cat) => (
                        <a
                          key={cat}
                          href={`#category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-5 py-2.5 text-sm text-stone-700 hover:bg-green-50 hover:text-green-900 transition-colors"
                        >
                          {cat}
                        </a>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-8">
              {[
                "New Arrivals",
                "Featured Vendors",
                "Flash Deals",
                "Top Rated",
                "Voucher Center",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-stone-600 hover:text-green-800 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              AURA OFFICIAL STORE
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-white border-t border-stone-200 overflow-hidden shadow-inner"
          >
            <div className="px-6 py-5 space-y-6">
              <div className="flex md:hidden items-center bg-stone-100 border border-stone-200 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full text-sm bg-transparent outline-none border-none text-stone-800"
                />
                <Search size={16} className="text-stone-400" />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase text-stone-400 tracking-widest mb-3">
                  Shop Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href={`#category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm bg-stone-50 rounded-lg text-stone-700 hover:bg-green-50 hover:text-green-950 transition-all font-medium"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-3">
                {[
                  "Featured Vendors",
                  "Flash Deals",
                  "Sell on Aura",
                  "Voucher Center",
                  "Customer Care",
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-stone-700 hover:text-green-800"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href="#account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 bg-green-800 text-white rounded-xl text-center font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  <span>My Account / Sign In</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
