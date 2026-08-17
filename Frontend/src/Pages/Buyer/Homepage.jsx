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
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import Navbar from "../../Components/auth/Navbar.jsx";
import Footer from "../../Components/auth/Footer.jsx";
import ProductCard from "../../Components/auth/ProductCard.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/authSlice.js";
import API from "../../utils/axios.js";

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
  const springX = useSpring(x, { stiffness: 500, damping: 25 });
  const springY = useSpring(y, { stiffness: 500, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
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
    animate={{ y: [0, -24, 0], opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
    transition={{
      duration: style.duration || 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: style.delay || 0,
    }}
  />
);

const useCountdown = (h = 4, m = 32, s = 15) => {
  const [time, setTime] = useState({ h, m, s });
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

const Homepage = () => {
  const [formEmail, setFormEmail] = useState("");
  const [productCategoryTab, setProductCategoryTab] = useState("all");
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Products: own loading/error state, scoped to the product sections only
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Categories: fetched independently, no dedicated loading/error UI
  const [category, setCategory] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    {
      url: "https://www.truelogic.com.ph/wp-content/uploads/2024/06/truelogic-podcast-marketplace-vs-ecommerce.png",
      title: "Global Marketplace",
    },
    {
      url: "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZSUyMGNvbW1lcmNlfGVufDB8fDB8fHww",
      title: "Curated Products",
    },
    {
      url: "https://thumbs.dreamstime.com/b/retail-store-display-home-goods-shelves-toronto-canada-march-displays-such-as-pet-beds-decorative-items-shoppers-451548377.jpg",
      title: "Premium Goods",
    },
    {
      url: "https://images.pexels.com/photos/16097558/pexels-photo-16097558/free-photo-of-young-woman-browsing-clothes-on-sale.jpeg",
      title: "Global Products",
    },
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSO4IBEDTzVgjXNLLBgUMMzk2IyhAyWF61-mxaZgKF53Np0lSeCyMC8gs&s=10",
      title: "Sustainable Fashion",
    },
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const countdown = useCountdown();
  const pad = (n) => String(n).padStart(2, "0");

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const res = await API.get("/api/product/getall");

      if (!res.data || !res.data.data) {
        throw new Error("Invalid response format from server");
      }

      setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      setRetryCount(0);
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load products. Please try again.";
      setProductsError(errorMessage);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await API.get("/api/category/getall");

      if (!res.data || !res.data.data) {
        throw new Error("Invalid response format from server");
      }

      setCategory(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // No dedicated loading/error UI for categories — falls back to the
      // existing "No categories available" empty state below.
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  const handleRetryProducts = () => {
    setRetryCount((prev) => prev + 1);
    setProductsError(null);
    fetchProducts();
  };

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

  const stats = [
    {
      icon: <Globe size={22} />,
      value: 500,
      suffix: "+",
      label: "Global Shops",
    },
    {
      icon: <Users size={22} />,
      value: 12000,
      suffix: "+",
      label: "Happy Buyers",
    },
    {
      icon: <TrendingUp size={22} />,
      value: 98,
      suffix: "%",
      label: "Satisfaction Rate",
    },
    {
      icon: <Shield size={22} />,
      value: 100,
      suffix: "%",
      label: "Secure Payments",
    },
  ];

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const features = [
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
  ];

  const categoryTabs = [
    { key: "all", label: "All Marketplace" },
    { key: "beauty", label: "Beauty & Skincare" },
    { key: "fashion", label: "Artisanal Wear" },
    { key: "home", label: "Home & Living" },
    { key: "electronics", label: "Eco Electronics" },
  ];

  const defaultCategoryImage =
    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop";

  // Shared loading/error UI for the product sections (Flash Deals + Discover Products)
  const renderProductsState = () => {
    if (productsLoading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <LoaderCircle size={40} className="text-green-800" />
          </motion.div>
          <p className="text-stone-600 text-base font-medium">
            Loading products...
          </p>
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="col-span-full flex items-center justify-center py-16 px-4">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center shadow-sm max-w-md"
          >
            <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Couldn't load products
            </h3>
            <p className="text-stone-600 mb-6 text-sm">{productsError}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRetryProducts}
              className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-semibold text-sm"
            >
              Try Again
            </motion.button>
            {retryCount > 2 && (
              <p className="text-xs text-stone-500 mt-4">
                If the problem persists, please contact support or try again
                later.
              </p>
            )}
          </motion.div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-stone-50 font-sans overflow-x-hidden min-h-screen text-stone-800">
      <Navbar />

      <section className="relative w-full h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentSlide].url}
              alt={heroImages[currentSlide].title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultCategoryImage;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
          </motion.div>
        </AnimatePresence>

        <FloatingOrb
          style={{
            width: 320,
            height: 320,
            background:
              "radial-gradient(circle, rgba(120,180,120,0.15), transparent 70%)",
            top: "15%",
            right: "10%",
            duration: 7,
            delay: 0,
            zIndex: 5,
          }}
        />
        <FloatingOrb
          style={{
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle, rgba(200,160,80,0.12), transparent 70%)",
            bottom: "20%",
            right: "35%",
            duration: 9,
            delay: 2,
            zIndex: 5,
          }}
        />

        <motion.div
          className="relative h-full flex items-center -mt-6 md:-mt-10 z-10"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.div variants={slideUp} className="mt-5 mb-8">
                <motion.span
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 text-amber-100 border border-amber-400/40 rounded-full text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(245,158,11,0)",
                      "0 0 22px rgba(245,158,11,0.35)",
                      "0 0 0px rgba(245,158,11,0)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Sparkles size={13} />
                  Global Multivendor Platform
                </motion.span>
              </motion.div>

              <motion.h1
                variants={staggerContainer}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.03em] text-white mb-10"
              >
                {[
                  "Exceptional",
                  "Products.",
                  "Trusted",
                  "Sellers.",
                  "One",
                  "Marketplace.",
                ].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 50,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          delay: 0.3 + i * 0.08,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      },
                    }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                variants={slideUp}
                className="max-w-2xl text-lg md:text-xl leading-[2] text-gray-200/90 font-light tracking-[0.015em] mb-14"
              >
                Experience a thoughtfully curated marketplace where independent
                brands, skilled artisans, and sustainable creators connect with
                customers seeking authenticity, quality, and timeless
                craftsmanship.
              </motion.p>

              <motion.div variants={slideUp} className="flex flex-wrap gap-4">
                <MagneticButton className="px-8 py-4 bg-green-700 hover:bg-green-600 text-white font-bold rounded-full transition-colors shadow-xl hover:shadow-2xl flex items-center gap-2 cursor-pointer text-base">
                  <ShoppingBag size={20} />
                  Shop Marketplace
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight size={20} />
                  </motion.span>
                </MagneticButton>

                <AnimatePresence mode="wait">
                  {isAuthenticated ? (
                    <motion.div
                      key="auth-hero"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 flex-wrap"
                    >
                      <div className="flex items-center gap-3 px-6 py-4 bg-white/15 border border-white/30 rounded-full backdrop-blur-md">
                        <span className="text-white font-semibold">
                          Welcome, {user?.name?.split(" ")[0] || "User"}
                        </span>
                      </div>

                      {user?.role === "seller" && (
                        <MagneticButton
                          className="px-6 py-4 bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 font-bold rounded-full border border-amber-400/50 cursor-pointer flex items-center gap-2"
                          onClick={() => nav("/seller-dashboard")}
                        >
                          <Store size={17} />
                          My Store
                        </MagneticButton>
                      )}

                      {user?.role === "admin" && (
                        <MagneticButton
                          className="px-6 py-4 bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 font-bold rounded-full border border-amber-400/50 cursor-pointer flex items-center gap-2"
                          onClick={() => nav("/admin-dashboard")}
                        >
                          <Zap size={17} />
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
                      transition={{ duration: 0.3 }}
                    >
                      <MagneticButton
                        className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full backdrop-blur-md transition-colors border border-white/40 cursor-pointer text-base"
                        onClick={() => nav("/register")}
                      >
                        Become a Seller
                      </MagneticButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentSlide
                  ? "w-10 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-white/60 text-xs uppercase tracking-widest font-semibold">
            Scroll
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
            animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      <section className="py-8 bg-green-900 overflow-hidden relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 80px)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={slideUp}
                className="flex items-center gap-4 text-white"
              >
                <motion.div
                  className="p-3 rounded-2xl bg-white/10 text-green-300"
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {s.icon}
                </motion.div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold font-serif">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-green-300/80 text-xs font-semibold uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <RevealText>
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Zap className="text-amber-500 fill-amber-500" size={24} />
                </motion.div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                  Limited Offers
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
                Flash Deals
              </h2>
            </RevealText>

            <RevealText delay={0.15}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Ends In:
                </span>
                <div className="flex gap-2">
                  {[
                    { val: pad(countdown.h), label: "h" },
                    { val: pad(countdown.m), label: "m" },
                    { val: pad(countdown.s), label: "s" },
                  ].map((unit, i) => (
                    <AnimatePresence mode="popLayout" key={i}>
                      <motion.div
                        key={unit.val + i}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-baseline bg-green-50 border border-green-200 px-3 py-2 rounded-lg min-w-[48px] justify-center"
                      >
                        <span className="text-lg font-extrabold text-green-950 font-mono">
                          {unit.val}
                        </span>
                        <span className="text-xs font-bold text-green-700 ml-1">
                          {unit.label}
                        </span>
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
            {productsLoading || productsError ? (
              renderProductsState()
            ) : products && products.length > 0 ? (
              products.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product?._id || i}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.97 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.35,
                        delay: i * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    },
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                >
                  <ProductCard
                    product={{
                      ...product,
                      badgeText: "Flash Deal",
                      badgeColor: "orange",
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-stone-600 text-lg">
                  No products available for flash deals
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <RevealText className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-stone-600 text-base">
              Discover specialized product categories from our sustainable
              multi-vendor network.
            </p>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category && category.length > 0 ? (
              category.map((cat, i) => (
                <motion.div
                  key={cat?._id || i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.06,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.15 } }}
                  className="relative rounded-2xl overflow-hidden shadow-lg h-96 group border border-stone-200/60 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-stone-900/30 z-10 group-hover:bg-stone-900/20 transition-colors duration-300" />
                  <img
                    src={cat?.image?.url || defaultCategoryImage}
                    alt={cat?.name || "Category"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = defaultCategoryImage;
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-white flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-green-300 mb-2">
                      {cat?.isActive ? "Active" : "Coming Soon"}
                    </span>
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      {cat?.name || "Category"}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4">
                      {cat?.description || "Explore this collection"}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-green-300 transition-colors"
                    >
                      Shop Collection
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-stone-600 text-lg">
                  No categories available
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <RevealText className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-800 bg-green-50 px-4 py-2 rounded-full inline-block">
              All Stores Catalog
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mt-6 mb-4">
              Discover Products
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {categoryTabs.map((tab) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setProductCategoryTab(tab.key)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                    productCategoryTab === tab.key
                      ? "bg-green-800 border-green-800 text-white shadow-lg"
                      : "bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {tab.label}
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
              {productsLoading || productsError ? (
                renderProductsState()
              ) : products && products.length > 0 ? (
                products.map((product, i) => (
                  <motion.div
                    key={product?._id || i}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    whileHover={{ y: -6, transition: { duration: 0.1 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-stone-600 text-lg">
                    No products available
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <RevealText className="text-center mt-16" delay={0.15}>
            <MagneticButton className="px-8 py-4 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold rounded-full transition-colors cursor-pointer inline-flex items-center gap-2 text-base">
              <span>Explore All Products</span>
              <ChevronRight size={18} />
            </MagneticButton>
          </RevealText>
        </div>
      </section>

      <section className="py-20 bg-stone-50 border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
            <RevealText>
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-green-800" size={20} />
                <span className="text-xs font-extrabold uppercase tracking-widest text-green-800">
                  Meet the Producers
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
                Featured Shops
              </h2>
            </RevealText>
            <RevealText delay={0.1}>
              <a
                href="#all-vendors"
                className="text-green-800 hover:text-green-950 font-semibold flex items-center gap-1 group"
              >
                View All 500+ Shops
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </a>
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVendors.map((vendor, i) => (
              <motion.div
                key={vendor?.name || i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                  transition: { duration: 0.15 },
                }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-40 relative bg-stone-100 overflow-hidden">
                  <img
                    src={vendor?.bannerImage}
                    alt={vendor?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = defaultCategoryImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-white border-2 border-stone-200 shadow-lg flex items-center justify-center text-2xl">
                    {vendor?.logo}
                  </div>
                </div>
                <div className="p-6 pt-10 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif text-xl font-bold text-stone-900 cursor-pointer">
                        {vendor?.name}
                      </h3>
                      <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-green-900 bg-green-50 border border-green-200 rounded-full">
                        {vendor?.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-sm text-stone-600">
                      <Star
                        size={14}
                        className="fill-amber-500 text-amber-500"
                      />
                      <span className="font-bold text-stone-800">
                        {vendor?.rating}
                      </span>
                      <span>•</span>
                      <span>{vendor?.productsCount} products</span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed mb-6">
                      {vendor?.description}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{
                      backgroundColor: "#166534",
                      color: "#f0fdf4",
                      borderColor: "#166534",
                    }}
                    className="w-full py-3 border border-stone-300 rounded-lg text-sm font-bold text-stone-700 transition-colors flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
                  >
                    <Compass size={16} />
                    <span>Visit Shop Portal</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.section
            key="auth-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-24 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden"
          >
            <motion.div
              className="absolute top-10 right-10 w-96 h-96 bg-green-400/8 rounded-full blur-3xl"
              animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-20 w-80 h-80 bg-green-300/8 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            <div className="relative max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.08 } },
                  }}
                  viewport={{ once: true }}
                  className="text-white"
                >
                  <motion.h2
                    variants={slideUp}
                    className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight"
                  >
                    Join Our Global Network
                  </motion.h2>
                  <motion.p
                    variants={slideUp}
                    className="text-lg text-green-50 leading-relaxed mb-12"
                  >
                    Register as a Shopper to collect coupons, or open a Creator
                    Account to list your products globally.
                  </motion.p>
                  <motion.div variants={staggerContainer} className="space-y-6">
                    {features.map((f, i) => (
                      <motion.div
                        key={i}
                        variants={slideUp}
                        className="flex items-start gap-4"
                        whileHover={{ x: 6 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className="text-3xl mt-1">{f.icon}</span>
                        <div>
                          <h3 className="font-semibold text-lg text-green-100">
                            {f.title}
                          </h3>
                          <p className="text-green-100/80 text-base leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center"
                >
                  <h3 className="font-serif text-4xl font-bold text-stone-900 mb-3">
                    Ready to Join?
                  </h3>
                  <p className="text-stone-600 text-base mb-10">
                    Access your account or create a new one
                  </p>

                  <div className="space-y-3 w-full">
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "#166534",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => nav("/login")}
                      className="w-full py-4 bg-green-800 text-white font-bold rounded-xl shadow-md transition-colors text-base cursor-pointer"
                    >
                      Sign In
                    </motion.button>

                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        borderColor: "#166534",
                        backgroundColor: "#f0fdf4",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => nav("/register")}
                      className="w-full py-4 border-2 border-green-800 text-green-800 font-bold rounded-xl transition-colors text-base cursor-pointer bg-transparent hover:bg-green-50"
                    >
                      Create Account
                    </motion.button>
                  </div>

                  <div className="mt-10 pt-8 border-t border-stone-200 w-full">
                    <p className="text-sm text-stone-500 mb-3">
                      Already registered?
                    </p>
                    <motion.a
                      href="/login"
                      whileHover={{ color: "#166534" }}
                      className="text-green-800 hover:text-green-950 font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      Go to Sign In
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ChevronRight size={16} />
                      </motion.span>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="user-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-24 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden"
          >
            <motion.div
              className="absolute top-10 right-10 w-96 h-96 bg-green-400/8 rounded-full blur-3xl"
              animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-20 w-80 h-80 bg-green-300/8 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            <div className="relative max-w-6xl mx-auto px-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="flex flex-col lg:flex-row items-center justify-between gap-12"
              >
                <div className="text-white text-center lg:text-left">
                  <motion.div
                    variants={slideUp}
                    className="flex items-center gap-4 mb-6 justify-center lg:justify-start"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 text-white font-bold flex items-center justify-center text-3xl font-serif">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="text-left">
                      <p className="text-green-300 text-xs uppercase tracking-widest font-semibold">
                        Welcome back
                      </p>
                      <h2 className="font-serif text-4xl font-bold">
                        {user?.name || "User"}
                      </h2>
                    </div>
                  </motion.div>
                  <motion.p
                    variants={slideUp}
                    className="text-green-100/80 text-base mb-3"
                  >
                    Signed in as{" "}
                    <span className="font-semibold text-white">
                      {user?.email || "user@example.com"}
                    </span>
                  </motion.p>
                  <motion.span
                    variants={slideUp}
                    className="inline-block px-4 py-2 bg-white/15 border border-white/30 rounded-full text-xs text-green-200 capitalize font-semibold tracking-wide"
                  >
                    {user?.role || "user"} Account
                  </motion.span>
                </div>

                <motion.div
                  variants={slideUp}
                  className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center w-full lg:w-auto"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "#f0fdf4",
                      color: "#14532d",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => nav("/profile")}
                    className="flex items-center gap-2.5 px-8 py-4 bg-white text-green-900 font-bold rounded-full shadow-lg transition-all cursor-pointer text-base"
                  >
                    <User size={18} />
                    My Profile
                  </motion.button>

                  {user?.role === "seller" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => nav("/seller-dashboard")}
                      className="flex items-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full shadow-lg transition-all cursor-pointer text-base"
                    >
                      <Store size={18} />
                      Seller Dashboard
                    </motion.button>
                  )}

                  {user?.role === "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => nav("/admin-dashboard")}
                      className="flex items-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full shadow-lg transition-all cursor-pointer text-base"
                    >
                      <Zap size={18} />
                      Admin Dashboard
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(239,68,68,0.15)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      dispatch(logout());
                      nav("/");
                    }}
                    className="flex items-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-red-500/10 border border-white/30 hover:border-red-400/50 text-white hover:text-red-300 font-bold rounded-full transition-all cursor-pointer text-base"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="py-24 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(120,180,120,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(200,160,60,0.06) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            viewport={{ once: true }}
          >
            <motion.span
              variants={slideUp}
              className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full inline-block"
            >
              Join the Circle
            </motion.span>
            <motion.h2
              variants={slideUp}
              className="font-serif text-5xl font-bold text-stone-900 mt-6 mb-4"
            >
              Subscribe for Eco Voucher Codes
            </motion.h2>
            <motion.p
              variants={slideUp}
              className="text-stone-600 text-lg max-w-2xl mx-auto mb-10"
            >
              Receive $15 off on your first order. Plus, get updates on new
              local stores, artisan spotlights, and green living tips.
            </motion.p>
            <motion.div
              variants={slideUp}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-stone-100 p-2 rounded-full border border-stone-300 focus-within:ring-2 focus-within:ring-green-800/20 focus-within:border-green-800 transition-all"
            >
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3.5 text-base bg-transparent outline-none border-none text-stone-800 placeholder-stone-500 rounded-full"
              />
              <motion.button
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#14532d",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-green-800 text-white font-bold rounded-full text-sm transition-colors cursor-pointer"
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
