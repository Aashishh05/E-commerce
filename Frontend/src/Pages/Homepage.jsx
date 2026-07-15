import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
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
  TrendingUp,
  Shield,
  Globe,
  LogOut,
  Store,
  User,
} from "lucide-react";

import Navbar from "../Components/auth/Navbar";
import Footer from "../Components/auth/Footer";
import ProductCard from "../Components/auth/ProductCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice";

/* ─── Reusable animated components ─── */

const RevealText = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

const CountUp = ({ end, suffix = "", prefix = "", duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const MagneticButton = ({ children, className = "", onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const FloatingOrb = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{
      y: [0, -24, 0],
      opacity: [0.4, 0.7, 0.4],
      scale: [1, 1.08, 1],
    }}
    transition={{
      duration: style.duration || 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: style.delay || 0,
    }}
  />
);

const useCountdown = (initialH = 4, initialM = 32, initialS = 15) => {
  const [time, setTime] = useState({ h: initialH, m: initialM, s: initialS });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

/* ══════════════════════════════════════════════
   MAIN HOMEPAGE COMPONENT
══════════════════════════════════════════════ */
const Homepage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [productCategoryTab, setProductCategoryTab] = useState("all");
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const countdown = useCountdown();
  const pad = (n) => String(n).padStart(2, "0");

  const products = [
    {
      id: 1,
      name: "Botanical Face Serum & Jade Roller Set",
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.8,
      reviewsCount: 120,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&h=600&fit=crop",
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
      bannerImage: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=200&fit=crop",
      description: "100% natural botanical skincare & self-care elixirs.",
    },
    {
      name: "Linen & Loom",
      type: "Local Artisan",
      rating: 4.8,
      productsCount: 42,
      logo: "🧵",
      bannerImage: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=200&fit=crop",
      description: "Slow-fashion garments spun from pure, bio-degradable flax fibers.",
    },
    {
      name: "Earthy Pots Co.",
      type: "Verified Studio",
      rating: 4.7,
      productsCount: 29,
      logo: "🏺",
      bannerImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=200&fit=crop",
      description: "Stoneware ceramics handcrafted in wood-fired mountain kilns.",
    },
  ];

  const stats = [
    { icon: <Globe size={22} />, value: 500, suffix: "+", label: "Global Shops" },
    { icon: <Users size={22} />, value: 12000, suffix: "+", label: "Happy Buyers" },
    { icon: <TrendingUp size={22} />, value: 98, suffix: "%", label: "Satisfaction Rate" },
    { icon: <Shield size={22} />, value: 100, suffix: "%", label: "Secure Payments" },
  ];

  const filteredProducts =
    productCategoryTab === "all"
      ? products
      : products.filter((p) => p.category.toLowerCase() === productCategoryTab.toLowerCase());

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="bg-stone-50 font-sans overflow-x-hidden min-h-screen text-stone-800">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="relative h-[92vh] flex items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/85 via-stone-900/55 to-stone-900/15" />
        </motion.div>

        <FloatingOrb style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(120,180,120,0.18), transparent 70%)", top: "10%", right: "15%", duration: 7, delay: 0 }} />
        <FloatingOrb style={{ width: 200, height: 200, background: "radial-gradient(circle, rgba(200,160,80,0.15), transparent 70%)", bottom: "20%", right: "30%", duration: 9, delay: 2 }} />
        <FloatingOrb style={{ width: 150, height: 150, background: "radial-gradient(circle, rgba(100,160,100,0.12), transparent 70%)", top: "40%", right: "8%", duration: 5, delay: 1 }} />

        <motion.div className="relative max-w-7xl mx-auto w-full px-6 z-10" style={{ opacity: heroOpacity }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl text-stone-100">
            <motion.div variants={slideUp} className="mb-6">
              <motion.span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider"
                animate={{ boxShadow: ["0 0 0px rgba(245,158,11,0)", "0 0 16px rgba(245,158,11,0.3)", "0 0 0px rgba(245,158,11,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Sparkles size={12} />
                Global Multivendor Platform
              </motion.span>
            </motion.div>

            <motion.h1 variants={staggerContainer} className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
              {["Curated", "by", "Hand.", "Sold", "by", "Creators."].map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: -20 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] } },
                  }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p variants={slideUp} className="text-lg md:text-xl text-stone-200 mb-10 leading-relaxed max-w-xl">
              Explore independent boutiques, organic growers, and zero-waste craftsmen from around the globe. Authenticity, guaranteed.
            </motion.p>

            {/* ── Hero CTAs — auth-aware ── */}
            <motion.div variants={slideUp} className="flex flex-wrap gap-4">
              <MagneticButton className="px-8 py-3.5 bg-green-800 text-stone-100 font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-2xl flex items-center gap-2 cursor-pointer">
                <ShoppingBag size={18} />
                Shop Marketplace
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ChevronRight size={18} />
                </motion.span>
              </MagneticButton>

              <AnimatePresence mode="wait">
                {isAuthenticated ? (
                  <motion.div
                    key="auth-hero"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-2.5 px-5 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
                      <div className="w-7 h-7 rounded-full bg-green-400/30 text-white font-bold flex items-center justify-center text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-stone-100 font-semibold text-sm">
                        Welcome, {user?.name?.split(" ")[0]}
                      </span>
                    </div>
                    {user?.role === "seller" && (
                      <MagneticButton
                        className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold rounded-full border border-amber-400/30 text-sm cursor-pointer flex items-center gap-2"
                        onClick={() => nav("/seller-dashboard")}
                      >
                        <Store size={15} />
                        My Store
                      </MagneticButton>
                    )}
                    {user?.role === "admin" && (
                      <MagneticButton
                        className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold rounded-full border border-amber-400/30 text-sm cursor-pointer flex items-center gap-2"
                        onClick={() => nav("/admin-dashboard")}
                      >
                        <Zap size={15} />
                        Dashboard
                      </MagneticButton>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="guest-hero"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <MagneticButton
                      className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-stone-100 font-semibold rounded-full backdrop-blur-md transition-colors border border-white/30 cursor-pointer"
                      onClick={() => nav("/register")}
                    >
                      Become a Seller
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">Scroll</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <section className="py-10 bg-green-900 overflow-hidden relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 80px)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={slideUp} className="flex items-center gap-4 text-white">
                <motion.div
                  className="p-3 rounded-2xl bg-white/10 text-green-300"
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {s.icon}
                </motion.div>
                <div>
                  <p className="text-2xl font-bold font-serif">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-green-300/80 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ FLASH SALES ══════════ */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <RevealText>
              <div className="flex items-center gap-2 mb-2">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}>
                  <Zap className="text-amber-500 fill-amber-500" size={22} />
                </motion.div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Limited Offers</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">Flash Deals</h2>
            </RevealText>

            <RevealText delay={0.2}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Ends In:</span>
                <div className="flex gap-2">
                  {[{ val: pad(countdown.h), label: "h" }, { val: pad(countdown.m), label: "m" }, { val: pad(countdown.s), label: "s" }].map((unit, i) => (
                    <AnimatePresence mode="popLayout" key={i}>
                      <motion.div
                        key={unit.val + i}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-baseline bg-green-50 border border-green-200/50 px-2.5 py-1.5 rounded-lg min-w-[44px] justify-center"
                      >
                        <span className="text-base font-extrabold text-green-950 font-mono">{unit.val}</span>
                        <span className="text-[10px] font-bold text-green-700 ml-0.5">{unit.label}</span>
                      </motion.div>
                    </AnimatePresence>
                  ))}
                </div>
              </div>
            </RevealText>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.97 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <ProductCard product={{ ...product, badgeText: "Flash Deal", badgeColor: "orange" }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ CAMPAIGN BANNERS ══════════ */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <RevealText className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-3">Explore Campaigns</h2>
            <p className="text-stone-600 text-sm">Discover specialized categories supported by our sustainable multi-vendor network.</p>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop", label: "AURA ORIGINAL BEAUTY", labelColor: "text-green-300", title: "Botanical Wellness", desc: "Naturally formulated skincare products made from hand-harvested wild herbs.", href: "#beauty", linkColor: "hover:text-green-300" },
              { img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop", label: "SLOW APPAREL", labelColor: "text-amber-300", title: "Sustainable Garments", desc: "Bespoke robes, caps, and garments made from 100% natural, biodegradable fabrics.", href: "#fashion", linkColor: "hover:text-amber-300" },
              { img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", label: "WOOD & CERAMICS", labelColor: "text-green-300", title: "Earthy Living", desc: "Stoneware coffee sets and hand-turned oak wood servers for organic kitchen layouts.", href: "#home", linkColor: "hover:text-green-300", span: "md:col-span-2 lg:col-span-1" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8 }}
                className={`relative rounded-3xl overflow-hidden shadow-md h-96 group border border-stone-200/60 cursor-pointer ${card.span || ""}`}
              >
                <motion.div className="absolute inset-0 bg-stone-900/40 z-10" whileHover={{ backgroundColor: "rgba(28,25,23,0.25)" }} transition={{ duration: 0.3 }} />
                <motion.img src={card.img} alt={card.title} className="w-full h-full object-cover" whileHover={{ scale: 1.07 }} transition={{ duration: 0.7, ease: "easeOut" }} />
                <motion.div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white flex flex-col justify-end" initial={{ y: 8 }} whileHover={{ y: 0 }} transition={{ duration: 0.3 }}>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${card.labelColor} mb-1`}>{card.label}</span>
                  <h3 className="font-serif text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-xs text-stone-200 mb-4 font-medium">{card.desc}</p>
                  <a href={card.href} className={`inline-flex items-center gap-1.5 text-sm font-bold text-white ${card.linkColor} transition-colors group/link`}>
                    Shop Collection
                    <motion.span className="group-hover/link:translate-x-1 transition-transform inline-block"><ArrowRight size={14} /></motion.span>
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CATALOG GRID ══════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <RevealText className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-800">All Stores Catalog</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-4">Discover Products</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { key: "all", label: "All Marketplace" },
                { key: "beauty", label: "Beauty & Skincare" },
                { key: "fashion", label: "Artisanal Wear" },
                { key: "home", label: "Home & Living" },
                { key: "electronics", label: "Eco Electronics" },
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setProductCategoryTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer relative overflow-hidden ${productCategoryTab === tab.key ? "bg-green-800 border-green-800 text-stone-100" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900"}`}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {tab.label}
                  {productCategoryTab === tab.key && (
                    <motion.div layoutId="activeFilterPill" className="absolute inset-0 bg-green-800 rounded-full -z-10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                </motion.button>
              ))}
            </div>
          </RevealText>

          <AnimatePresence mode="wait">
            <motion.div
              key={productCategoryTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <RevealText className="text-center mt-12" delay={0.2}>
            <MagneticButton className="px-8 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold rounded-full text-sm transition-colors cursor-pointer inline-flex items-center gap-2">
              <span>Explore All Products</span>
              <ChevronRight size={16} />
            </MagneticButton>
          </RevealText>
        </div>
      </section>

      {/* ══════════ FEATURED SHOPS ══════════ */}
      <section className="py-16 bg-stone-50 border-t border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <RevealText>
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-green-800" size={18} />
                <span className="text-xs font-extrabold uppercase tracking-widest text-green-800">Meet the Producers</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">Featured Shops</h2>
            </RevealText>
            <RevealText delay={0.15}>
              <a href="#all-vendors" className="text-green-800 hover:text-green-950 font-semibold text-sm flex items-center gap-1 group">
                View All 500+ Shops
                <motion.span className="inline-block" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                  <ArrowRight size={14} />
                </motion.span>
              </a>
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVendors.map((vendor, i) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.10)" }}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden transition-all duration-300 flex flex-col h-full"
              >
                <motion.div className="h-32 relative bg-stone-100 overflow-hidden">
                  <motion.img src={vendor.bannerImage} alt={vendor.name} className="w-full h-full object-cover opacity-80" whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <motion.div className="absolute -bottom-5 left-6 w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-md flex items-center justify-center text-xl" whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                    {vendor.logo}
                  </motion.div>
                </motion.div>
                <div className="p-6 pt-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold text-stone-900 cursor-pointer">{vendor.name}</h3>
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-900 bg-green-50 border border-green-200/30 rounded-full">{vendor.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-3 text-xs text-stone-500">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span className="font-bold text-stone-700">{vendor.rating}</span>
                      <span>•</span>
                      <span>{vendor.productsCount} products</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed mb-6">{vendor.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ backgroundColor: "#166534", color: "#f0fdf4", borderColor: "#166534" }}
                    className="w-full py-2.5 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Compass size={14} />
                    <span>Visit Shop Portal</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ AUTH SECTION — guest only ══════════ */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.section
            key="auth-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden"
          >
            <motion.div className="absolute top-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute bottom-0 left-10 w-80 h-80 bg-green-300/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

            <div className="relative max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial="hidden" whileInView="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }} viewport={{ once: true }} className="text-white">
                  <motion.h2 variants={slideUp} className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">Join Our Global Network</motion.h2>
                  <motion.p variants={slideUp} className="text-lg text-green-50 leading-relaxed mb-10">Register as a Shopper to collect coupons, or open a Creator Account to list your products globally.</motion.p>
                  <motion.div variants={staggerContainer} className="space-y-6">
                    {[
                      { icon: "🌿", title: "Curated Sellers Only", desc: "Every store is audited for premium sustainable quality." },
                      { icon: "🛡️", title: "Aura Buyer Protection", desc: "Secure escrow payments and hassle-free local returns." },
                      { icon: "✨", title: "Artisanal & Original", desc: "Handcrafted items, green tech, and organic foods." },
                    ].map((f, i) => (
                      <motion.div key={i} variants={slideUp} className="flex items-start gap-4 group" whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 400 }}>
                        <motion.span className="text-2xl mt-0.5" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 500 }}>{f.icon}</motion.span>
                        <div>
                          <h3 className="font-semibold text-lg text-green-200">{f.title}</h3>
                          <p className="text-green-100/90 text-sm">{f.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                  <div className="flex gap-6 mb-8 border-b border-stone-100 relative">
                    {["login", "signup"].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 font-bold text-base md:text-lg transition-colors capitalize cursor-pointer relative ${activeTab === tab ? "text-green-800" : "text-stone-400 hover:text-stone-600"}`}>
                        {tab === "login" ? "Sign In" : "Create Account"}
                        {activeTab === tab && <motion.div layoutId="authUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-800" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "login" ? (
                      <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Email Address</label>
                          <motion.input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@email.com" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all text-sm" whileFocus={{ scale: 1.01 }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Password</label>
                          <div className="relative">
                            <motion.input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 transition-all text-sm" whileFocus={{ scale: 1.01 }} />
                            <motion.button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer" whileTap={{ scale: 0.9 }}>
                              <AnimatePresence mode="wait">
                                {showPassword ? (
                                  <motion.span key="off" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><EyeOff size={16} /></motion.span>
                                ) : (
                                  <motion.span key="on" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Eye size={16} /></motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-green-800 focus:ring-green-800" />
                            <span className="text-stone-500 font-medium">Keep me signed in</span>
                          </label>
                          <a href="#" className="text-green-800 hover:text-green-950 font-bold">Forgot password?</a>
                        </div>
                        <motion.button whileHover={{ scale: 1.02, backgroundColor: "#14532d" }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-green-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm" onClick={() => nav("/login")}>
                          Sign In
                        </motion.button>
                        <p className="text-center text-xs text-stone-500">Need an account?{" "}<button onClick={() => setActiveTab("signup")} className="text-green-800 font-bold hover:underline cursor-pointer">Sign up free</button></p>
                      </motion.div>
                    ) : (
                      <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {["First Name", "Last Name"].map((label, i) => (
                            <div key={i}>
                              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">{label}</label>
                              <motion.input type="text" placeholder={i === 0 ? "John" : "Doe"} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 text-sm" whileFocus={{ scale: 1.01 }} />
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">Email Address</label>
                          <motion.input type="email" placeholder="john.doe@email.com" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 text-sm" whileFocus={{ scale: 1.01 }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">Password</label>
                          <motion.input type="password" placeholder="At least 8 characters" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800 text-sm" whileFocus={{ scale: 1.01 }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 text-amber-700">Account Type</label>
                          <div className="grid grid-cols-2 gap-3 mt-1.5">
                            {["Shopper", "Vendor / Shop"].map((role, i) => (
                              <motion.label key={i} className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 select-none" whileHover={{ scale: 1.02, borderColor: "#166534" }} whileTap={{ scale: 0.98 }}>
                                <input type="radio" name="role" defaultChecked={i === 0} className="text-green-800 focus:ring-green-800" />
                                <span className="text-xs font-semibold text-stone-700">{role}</span>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                        <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                          <input type="checkbox" className="rounded mt-0.5 text-green-800 focus:ring-green-800" />
                          <span className="text-xs text-stone-500 font-medium leading-tight">I agree to the{" "}<a href="#" className="text-green-800 font-bold hover:underline">Aura Buyer Terms</a>{" "}and{" "}<a href="#" className="text-green-800 font-bold hover:underline">Privacy Policy</a>.</span>
                        </label>
                        <motion.button whileHover={{ scale: 1.02, backgroundColor: "#14532d" }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-green-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm mt-2" onClick={() => nav("/register")}>
                          Create Account
                        </motion.button>
                        <p className="text-center text-xs text-stone-500 pt-1">Already have an account?{" "}<button onClick={() => setActiveTab("login")} className="text-green-800 font-bold hover:underline cursor-pointer">Sign in</button></p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.section>
        ) : (
          /* ── Authenticated welcome banner replaces auth section ── */
          <motion.section
            key="user-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden"
          >
            <motion.div className="absolute top-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute bottom-0 left-10 w-80 h-80 bg-green-300/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

            <div className="relative max-w-6xl mx-auto px-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                className="flex flex-col lg:flex-row items-center justify-between gap-10"
              >
                <div className="text-white text-center lg:text-left">
                  <motion.div variants={slideUp} className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                    <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-white/30 text-white font-bold flex items-center justify-center text-2xl font-serif">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-green-300 text-xs uppercase tracking-widest font-semibold">Welcome back</p>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold">{user?.name}</h2>
                    </div>
                  </motion.div>
                  <motion.p variants={slideUp} className="text-green-100/80 text-sm mb-2">
                    Signed in as <span className="font-semibold text-white">{user?.email}</span>
                  </motion.p>
                  <motion.span variants={slideUp} className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-green-200 capitalize font-semibold tracking-wide">
                    {user?.role} Account
                  </motion.span>
                </div>

                <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center">
                  <motion.button
                    whileHover={{ scale: 1.04, backgroundColor: "#f0fdf4", color: "#14532d" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => nav("/profile")}
                    className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-green-900 font-bold rounded-full shadow-lg transition-all text-sm cursor-pointer"
                  >
                    <User size={16} />
                    My Profile
                  </motion.button>

                  {user?.role === "seller" && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => nav("/seller-dashboard")}
                      className="flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full shadow-lg transition-all text-sm cursor-pointer"
                    >
                      <Store size={16} />
                      Seller Dashboard
                    </motion.button>
                  )}

                  {user?.role === "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => nav("/admin-dashboard")}
                      className="flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full shadow-lg transition-all text-sm cursor-pointer"
                    >
                      <Zap size={16} />
                      Admin Dashboard
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.04, backgroundColor: "rgba(239,68,68,0.15)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { dispatch(logout()); nav("/"); }}
                    className="flex items-center gap-2.5 px-7 py-3.5 bg-white/10 hover:bg-red-500/10 border border-white/20 hover:border-red-400/40 text-white hover:text-red-300 font-bold rounded-full transition-all text-sm cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══════════ NEWSLETTER ══════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(120,180,120,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(200,160,60,0.06) 0%, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }} viewport={{ once: true }}>
            <motion.span variants={slideUp} className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full inline-block">Join the Circle</motion.span>
            <motion.h2 variants={slideUp} className="font-serif text-4xl font-bold text-stone-900 mt-4 mb-3">Subscribe for Eco Voucher Codes</motion.h2>
            <motion.p variants={slideUp} className="text-stone-500 text-sm max-w-md mx-auto mb-8">Receive $15 off on your first order. Plus, get updates on new local stores, artisan spotlights, and green living.</motion.p>
            <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-stone-100 p-1.5 rounded-2xl sm:rounded-full border border-stone-200 focus-within:ring-2 focus-within:ring-green-800/10 focus-within:border-green-800 transition-all">
              <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none border-none text-stone-800 placeholder-stone-400 rounded-full" />
              <motion.button whileHover={{ scale: 1.04, backgroundColor: "#14532d" }} whileTap={{ scale: 0.97 }} className="px-6 py-2.5 bg-green-800 text-stone-100 font-bold rounded-xl sm:rounded-full text-xs transition-colors cursor-pointer">Get Voucher</motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;