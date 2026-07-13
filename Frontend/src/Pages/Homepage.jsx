import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Users,
  Compass,
} from "lucide-react";

import Navbar from "../Components/auth/Navbar";
import Footer from "../Components/auth/Footer";
import ProductCard from "../Components/auth/ProductCard";
const Homepage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [productCategoryTab, setProductCategoryTab] = useState("all");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  };

  const products = [
    {
      id: 1,
      name: "Botanical Face Serum & Jade Roller Set",
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.8,
      reviewsCount: 120,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
      category: "Beauty",
      vendorName: "Aura Botanicals",
      badgeText: "Seller Pick",
      badgeColor: "green",
    },
    {
      id: 2,
      name: "Handcrafted Cold-Pressed Herbal Oils",
      price: 19.99,
      originalPrice: 25.99,
      rating: 4.9,
      reviewsCount: 88,
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
      category: "Beauty",
      vendorName: "Aura Botanicals",
      badgeText: "Trending",
      badgeColor: "amber",
    },
    {
      id: 3,
      name: "Handspun Organic Linen Summer Kimono",
      price: 85.0,
      originalPrice: 110.0,
      rating: 4.9,
      reviewsCount: 45,
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop",
      category: "Fashion",
      vendorName: "Linen & Loom",
      badgeText: "Limited Edition",
      badgeColor: "amber",
    },
    {
      id: 4,
      name: "Artisanal Ceramic Coffee Dripper & Mug Set",
      price: 29.5,
      originalPrice: 38.0,
      rating: 4.7,
      reviewsCount: 62,
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
      category: "Home",
      vendorName: "Earthy Pots Co.",
      badgeText: "Top Selling",
      badgeColor: "green",
    },
    {
      id: 5,
      name: "Smart Ultrasonic Aromatherapy Humidifier",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.6,
      reviewsCount: 154,
      image:
        "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
      category: "Wellness Tech",
      vendorName: "Aether Devices",
      badgeText: "Free Shipping",
      badgeColor: "green",
    },
    {
      id: 6,
      name: "Natural Bamboo Wireless Phone Charger",
      price: 39.0,
      originalPrice: null,
      rating: 4.5,
      reviewsCount: 37,
      image:
        "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&h=600&fit=crop",
      category: "Electronics",
      vendorName: "Aether Devices",
      badgeText: "New",
      badgeColor: "green",
    },
    {
      id: 7,
      name: "Eco-Conscious Soy Wax Scented Candles (Set of 3)",
      price: 22.99,
      originalPrice: 32.0,
      rating: 4.8,
      reviewsCount: 198,
      image:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop",
      category: "Home",
      vendorName: "Scented Haven",
      badgeText: "Hot Deal",
      badgeColor: "amber",
    },
    {
      id: 8,
      name: "Minimalist Handcrafted Oak Serving Board",
      price: 45.0,
      originalPrice: 55.0,
      rating: 4.9,
      reviewsCount: 41,
      image:
        "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&h=600&fit=crop",
      category: "Home",
      vendorName: "Loom & Wood",
      badgeText: "Artisan Crafted",
      badgeColor: "green",
    },
  ];

  const featuredVendors = [
    {
      name: "Aura Botanicals",
      type: "Official Store",
      rating: 4.9,
      productsCount: 65,
      logo: "🌿",
      bannerImage:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=200&fit=crop",
      description: "100% natural botanical skincare & self-care elixirs.",
    },
    {
      name: "Linen & Loom",
      type: "Local Artisan",
      rating: 4.8,
      productsCount: 42,
      logo: "🧵",
      bannerImage:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=200&fit=crop",
      description:
        "Slow-fashion garments spun from pure, bio-degradable flax fibers.",
    },
    {
      name: "Earthy Pots Co.",
      type: "Verified Studio",
      rating: 4.7,
      productsCount: 29,
      logo: "🏺",
      bannerImage:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=200&fit=crop",
      description:
        "Stoneware ceramics handcrafted in wood-fired mountain kilns.",
    },
  ];

  const filteredProducts =
    productCategoryTab === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === productCategoryTab.toLowerCase(),
        );

  return (
    <div className="bg-stone-50 font-sans overflow-x-hidden min-h-screen text-stone-800">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-stone-50">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-stone-900/10"></div>
        </motion.div>

        <div className="relative max-w-7xl mx-auto w-full px-6 flex items-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { staggerChildren: 0.2 } }}
            className="max-w-2xl text-stone-100"
          >
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="mb-6 flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} />
                Global Multivendor Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              Curated by Hand. Sold by Creators.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={2}
              className="text-lg md:text-xl text-stone-200 mb-8 leading-relaxed max-w-xl"
            >
              Explore independent boutiques, organic growers, and zero-waste
              craftsmen from around the globe. Authenticity, guaranteed.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-green-800 text-stone-100 font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={18} />
                Shop Marketplace <ChevronRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-stone-100 font-semibold rounded-full backdrop-blur-md transition-colors border border-white/30 cursor-pointer"
              >
                Become a Seller
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FLASH SALES SECTION ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap
                  className="text-amber-500 fill-amber-500 animate-bounce"
                  size={20}
                />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                  LIMITED OFFERS
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
                Flash Deals
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Ends In:
              </span>
              <div className="flex gap-2">
                {[
                  { val: "04", label: "h" },
                  { val: "32", label: "m" },
                  { val: "15", label: "s" },
                ].map((unit, i) => (
                  <div
                    key={i}
                    className="flex items-baseline bg-green-50 border border-green-200/50 px-2.5 py-1.5 rounded-lg"
                  >
                    <span className="text-base font-extrabold text-green-950 font-mono">
                      {unit.val}
                    </span>
                    <span className="text-[10px] font-bold text-green-700 ml-0.5">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  badgeText: "Flash Deal",
                  badgeColor: "orange",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAMPAIGN BANNER GRIDS ===== */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Explore Campaigns
            </h2>
            <p className="text-stone-600 text-sm">
              Discover specialized categories supported by our sustainable
              multi-vendor network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-3xl overflow-hidden shadow-md h-96 group border border-stone-200/60"
            >
              <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop"
                alt="Organic Beauty"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white flex flex-col justify-end">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-300 mb-1">
                  AURA ORIGINAL BEAUTY
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Botanical Wellness
                </h3>
                <p className="text-xs text-stone-200 mb-4 font-medium">
                  Naturally formulated skincare products made from
                  hand-harvested wild herbs.
                </p>
                <a
                  href="#beauty"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-green-300 transition-colors"
                >
                  Shop Collection <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-3xl overflow-hidden shadow-md h-96 group border border-stone-200/60"
            >
              <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop"
                alt="Slow Fashion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white flex flex-col justify-end">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 mb-1">
                  SLOW APPAREL
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Sustainable Garments
                </h3>
                <p className="text-xs text-stone-200 mb-4 font-medium">
                  Bespoke robes, caps, and garments made from 100% natural,
                  biodegradable fabrics.
                </p>
                <a
                  href="#fashion"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-amber-300 transition-colors"
                >
                  Explore Linen <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-3xl overflow-hidden shadow-md h-96 group border border-stone-200/60 md:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop"
                alt="Clay Ceramics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white flex flex-col justify-end">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-300 mb-1">
                  WOOD & CERAMICS
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Earthy Living
                </h3>
                <p className="text-xs text-stone-200 mb-4 font-medium">
                  Stoneware coffee sets and hand-turned oak wood servers for
                  organic kitchen layouts.
                </p>
                <a
                  href="#home"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-green-300 transition-colors"
                >
                  Shop Ceramic <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CATALOG GRID WITH FILTERS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-800">
              ALL STORES CATALOG
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-4">
              Discover Products
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { key: "all", label: "All Marketplace" },
                { key: "beauty", label: "Beauty & Skincare" },
                { key: "fashion", label: "Artisanal Wear" },
                { key: "home", label: "Home & Living" },
                { key: "electronics", label: "Eco Electronics" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setProductCategoryTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                    productCategoryTab === tab.key
                      ? "bg-green-800 border-green-800 text-stone-100"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={productCategoryTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold rounded-full text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <span>Explore All Products</span>
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ===== FEATURED STORES ===== */}
      <section className="py-16 bg-stone-50 border-t border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-green-800" size={18} />
                <span className="text-xs font-extrabold uppercase tracking-widest text-green-800">
                  MEET THE PRODUCERS
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
                Featured Shops
              </h2>
            </div>
            <a
              href="#all-vendors"
              className="text-green-800 hover:text-green-950 font-semibold text-sm flex items-center gap-1 group"
            >
              View All 500+ Shops{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVendors.map((vendor, i) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-32 relative bg-stone-100">
                  <img
                    src={vendor.bannerImage}
                    alt={vendor.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute -bottom-5 left-6 w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-md flex items-center justify-center text-xl">
                    {vendor.logo}
                  </div>
                </div>

                <div className="p-6 pt-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold text-stone-900 hover:text-green-850 cursor-pointer">
                        {vendor.name}
                      </h3>
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-900 bg-green-50 border border-green-200/30 rounded-full">
                        {vendor.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3 text-xs text-stone-500">
                      <div className="flex items-center text-amber-500">
                        <Star
                          size={12}
                          className="fill-amber-500 text-amber-500"
                        />
                      </div>
                      <span className="font-bold text-stone-700">
                        {vendor.rating}
                      </span>
                      <span>•</span>
                      <span>{vendor.productsCount} products</span>
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed mb-6">
                      {vendor.description}
                    </p>
                  </div>

                  <button className="w-full py-2.5 border border-stone-200 hover:border-green-850 hover:bg-green-850 hover:text-white rounded-xl text-xs font-bold text-stone-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                    <Compass size={14} />
                    <span>Visit Shop Portal</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOGIN/SIGNUP SECTION ===== */}
      <section className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-green-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{ visible: { staggerChildren: 0.15 } }}
              viewport={{ once: true }}
              className="text-white"
            >
              <motion.div variants={fadeInUp} custom={0} className="mb-8">
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Join Our Global Network
                </h2>
                <p className="text-lg text-green-50 leading-relaxed">
                  Register as a Shopper to collect coupons, or open a Creator
                  Account to list your products globally.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} custom={1} className="space-y-6">
                {[
                  {
                    icon: "🌿",
                    title: "Curated Sellers Only",
                    desc: "Every store is audited for premium sustainable quality.",
                  },
                  {
                    icon: "🛡️",
                    title: "Aura Buyer Protection",
                    desc: "Secure escrow payments and hassle-free local returns.",
                  },
                  {
                    icon: "✨",
                    title: "Artisanal & Original",
                    desc: "Handcrafted items, green tech, and organic foods.",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{feature.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg text-green-200">
                        {feature.title}
                      </h3>
                      <p className="text-green-100/90 text-sm">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={scaleIn}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
            >
              <div className="flex gap-6 mb-8 border-b border-stone-100">
                {["login", "signup"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-bold text-base md:text-lg transition-all capitalize cursor-pointer ${
                      activeTab === tab
                        ? "text-green-800 border-b-2 border-green-800"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              {activeTab === "login" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@email.com"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-850/20 focus:border-green-850 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-850/20 focus:border-green-850 transition-all text-sm"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-green-800 focus:ring-green-800"
                      />
                      <span className="text-stone-500 font-medium">
                        Keep me signed in
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-green-800 hover:text-green-950 font-bold"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 bg-green-800 hover:bg-green-900 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                  >
                    Sign In
                  </motion.button>

                  <p className="text-center text-xs text-stone-500">
                    Need an account?{" "}
                    <button
                      onClick={() => setActiveTab("signup")}
                      className="text-green-800 font-bold hover:underline cursor-pointer"
                    >
                      Sign up free
                    </button>
                  </p>
                </motion.div>
              )}

              {activeTab === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-850/20 focus:border-green-850 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-850/20 focus:border-green-850 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john.doe@email.com"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-850/20 focus:border-green-850 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-850/20 focus:border-green-850 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 font-bold text-amber-700">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      <label className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 select-none">
                        <input
                          type="radio"
                          name="role"
                          defaultChecked
                          className="text-green-850 focus:ring-green-850"
                        />
                        <span className="text-xs font-semibold text-stone-700">
                          Shopper
                        </span>
                      </label>
                      <label className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 select-none">
                        <input
                          type="radio"
                          name="role"
                          className="text-green-850 focus:ring-green-850"
                        />
                        <span className="text-xs font-semibold text-stone-700">
                          Vendor / Shop
                        </span>
                      </label>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      className="rounded mt-0.5 text-green-800 focus:ring-green-800"
                    />
                    <span className="text-xs text-stone-500 font-medium leading-tight">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-green-800 font-bold hover:underline"
                      >
                        Aura Buyer Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-green-800 font-bold hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 bg-green-800 hover:bg-green-900 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm mt-2"
                  >
                    Create Account
                  </motion.button>

                  <p className="text-center text-xs text-stone-500 pt-1">
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-green-800 font-bold hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{ visible: { staggerChildren: 0.15 } }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
              JOIN THE CIRCLE
            </span>
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="font-serif text-4xl font-bold text-stone-900 mt-4 mb-3"
            >
              Subscribe for Eco Voucher Codes
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-stone-500 text-sm max-w-md mx-auto mb-8"
            >
              Receive $15 off on your first order. Plus, get updates on new
              local stores, artisan spotlights, and green living.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={2}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-stone-100 p-1.5 rounded-2xl sm:rounded-full border border-stone-200 focus-within:ring-2 focus-within:ring-green-800/10 focus-within:border-green-850 transition-all"
            >
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none border-none text-stone-800 placeholder-stone-400 rounded-full"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-green-800 hover:bg-green-950 text-stone-100 font-bold rounded-xl sm:rounded-full text-xs transition-colors cursor-pointer"
              >
                Get Voucher
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
