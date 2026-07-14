import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Plus,
  Package,
  Tag,
  ArrowUpRight,
  Zap,
} from "lucide-react";

/* ─── CountUp Animation ─── */
const CountUp = ({ end, prefix = "", suffix = "", duration = 1.4 }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
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
  }, [started, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ─── Sparkline Chart ─── */
const Sparkline = ({ data, color = "#166534" }) => {
  const max = Math.max(...data),
    min = Math.min(...data);
  const w = 80,
    h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${x},${y}`;
  });
  const id = `sp-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} className="drop-shadow-sm">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={`url(#${id})`} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={parseFloat(pts[pts.length - 1].split(",")[0])}
        cy={parseFloat(pts[pts.length - 1].split(",")[1])}
        r="3"
        fill={color}
      />
    </svg>
  );
};

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    shipped: "text-green-800 bg-green-50/80 border-green-200/60",
    delivered: "text-green-800 bg-green-50/80 border-green-200/60",
    processing: "text-amber-700 bg-amber-50/80 border-amber-200/60",
    cancelled: "text-red-600 bg-red-50/80 border-red-200/60",
    pending: "text-amber-700 bg-amber-50/80 border-amber-200/60",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${
        map[status] || ""
      }`}
    >
      {status}
    </span>
  );
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const revenueWeek = [420, 680, 510, 890, 730, 960, 1140];
const ordersWeek = [8, 14, 10, 18, 15, 22, 27];
const visitsWeek = [210, 380, 290, 510, 440, 620, 750];

const recentOrders = [
  {
    id: "#ORD-5821",
    customer: "Sarah M.",
    product: "Botanical Face Serum",
    amount: 34.99,
    status: "shipped",
  },
  {
    id: "#ORD-5820",
    customer: "James K.",
    product: "Herbal Oils (2×)",
    amount: 39.98,
    status: "delivered",
  },
  {
    id: "#ORD-5819",
    customer: "Priya N.",
    product: "Rose Hip Night Cream",
    amount: 42.0,
    status: "processing",
  },
  {
    id: "#ORD-5818",
    customer: "Tom W.",
    product: "Soy Wax Candles Set",
    amount: 22.99,
    status: "shipped",
  },
  {
    id: "#ORD-5817",
    customer: "Anika R.",
    product: "Lavender Facial Mist",
    amount: 14.5,
    status: "delivered",
  },
];

const topProducts = [
  {
    name: "Soy Wax Candles (Set of 3)",
    sales: 198,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=80&h=80&fit=crop",
  },
  {
    name: "Botanical Face Serum & Jade Set",
    sales: 120,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop",
  },
  {
    name: "Handcrafted Herbal Oils",
    sales: 88,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=80&h=80&fit=crop",
  },
  {
    name: "Lavender Facial Mist",
    sales: 54,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop",
  },
  {
    name: "Rose Hip Night Cream",
    sales: 31,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=80&h=80&fit=crop",
  },
];

const SellerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Revenue",
      value: 6840,
      prefix: "$",
      suffix: "",
      change: +18,
      spark: revenueWeek,
      icon: <DollarSign size={16} />,
      color: "from-green-50 to-green-100/50",
    },
    {
      label: "Orders This Week",
      value: 27,
      prefix: "",
      suffix: "",
      change: +34,
      spark: ordersWeek,
      icon: <ShoppingCart size={16} />,
      color: "from-blue-50 to-blue-100/50",
    },
    {
      label: "Store Visitors",
      value: 750,
      prefix: "",
      suffix: "",
      change: +21,
      spark: visitsWeek,
      icon: <Eye size={16} />,
      color: "from-amber-50 to-amber-100/50",
    },
    {
      label: "Avg. Rating",
      value: 4.6,
      prefix: "",
      suffix: "★",
      change: +2,
      spark: [4.2, 4.3, 4.4, 4.3, 4.5, 4.5, 4.6],
      icon: <Star size={16} />,
      color: "from-purple-50 to-purple-100/50",
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── Header Section ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="text-amber-500 fill-amber-500" size={20} />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Store Dashboard
            </span>
          </motion.div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            Good morning, Aashish 🌿
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Here's your store performance this week
          </p>
        </motion.div>

        <motion.button
          variants={fadeUp}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 12px 32px rgba(22, 101, 52, 0.25)",
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/product-form")}
          className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer h-fit"
        >
          <Plus size={16} />
          <span>Add Product</span>
          <ArrowUpRight size={14} />
        </motion.button>
      </motion.div>

      {/* ── Stat Cards Grid ── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{
              y: -6,
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.08)",
              transition: { duration: 0.25 },
            }}
            className={`bg-gradient-to-br ${s.color} border border-stone-200/60 rounded-3xl p-6 flex flex-col gap-4 transition-all backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                  {s.label}
                </p>
                <p className="font-serif text-3xl font-bold text-stone-900 mt-2 font-mono">
                  <CountUp
                    end={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </p>
              </div>
              <motion.div
                className="p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40"
                whileHover={{ rotate: 12, scale: 1.12 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="text-green-700">{s.icon}</div>
              </motion.div>
            </div>
            <div className="flex items-end justify-between pt-2 border-t border-white/40">
              <span
                className={`flex items-center gap-1.5 text-xs font-bold ${
                  s.change >= 0 ? "text-green-700" : "text-red-500"
                }`}
              >
                {s.change >= 0 ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}
                {s.change >= 0 ? "+" : ""}
                {s.change}% vs last week
              </span>
              <Sparkline data={s.spark} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Orders + Products Section ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          variants={fadeUp}
          whileHover={{
            boxShadow: "0 20px 48px rgba(0, 0, 0, 0.08)",
          }}
          className="xl:col-span-2 bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl overflow-hidden shadow-sm transition-all"
        >
          <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100/60 bg-gradient-to-r from-white to-stone-50/50">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Recent Orders
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Last 5 orders from your store
              </p>
            </div>
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => navigate("/seller/orders")}
              className="text-xs text-green-700 font-bold flex items-center gap-1.5 hover:text-green-900 cursor-pointer"
            >
              View all
              <ChevronRight size={14} />
            </motion.button>
          </div>
          <div className="divide-y divide-stone-100/60">
            {recentOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                whileHover={{ backgroundColor: "rgba(22, 101, 52, 0.02)" }}
                className="flex items-center gap-4 px-8 py-4 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-800 text-xs font-bold flex items-center justify-center shrink-0">
                  {order.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-800">
                    {order.customer}
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">
                    {order.product}
                  </p>
                </div>
                <span className="text-xs font-mono text-stone-400 hidden sm:block">
                  {order.id}
                </span>
                <StatusBadge status={order.status} />
                <span className="text-sm font-bold font-mono text-stone-800 w-16 text-right">
                  ${order.amount.toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          variants={fadeUp}
          whileHover={{
            boxShadow: "0 20px 48px rgba(0, 0, 0, 0.08)",
          }}
          className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-3xl overflow-hidden shadow-sm transition-all"
        >
          <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100/60 bg-gradient-to-r from-white to-stone-50/50">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Top Products
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">This month</p>
            </div>
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => navigate("/seller/products")}
              className="text-xs text-green-700 font-bold flex items-center gap-1.5 hover:text-green-900 cursor-pointer"
            >
              Manage
              <ChevronRight size={14} />
            </motion.button>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 group"
              >
                <span className="text-xs font-bold text-stone-300 w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <motion.img
                  src={p.image}
                  alt={p.name}
                  className="w-10 h-10 rounded-xl object-cover border border-stone-200/60"
                  whileHover={{ scale: 1.08 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-800 truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 rounded-full bg-stone-200 flex-1 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-700"
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.sales / 200) * 100}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + i * 0.08,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono shrink-0">
                      {p.sales}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Add Product",
            icon: <Plus size={18} />,
            path: "/product-form",
            color: "from-green-600 to-green-700",
          },
          {
            label: "Add Category",
            icon: <Tag size={18} />,
            path: "/category-form",
            color: "from-blue-600 to-blue-700",
          },
          {
            label: "View Orders",
            icon: <ShoppingCart size={18} />,
            path: "/orders",
            color: "from-amber-600 to-amber-700",
          },
          {
            label: "Analytics",
            icon: <TrendingUp size={18} />,
            path: "/seller/analytics",
            color: "from-purple-600 to-purple-700",
          },
        ].map((a, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(a.path)}
            variants={fadeUp}
            whileHover={{
              y: -4,
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 p-4 md:p-5 bg-gradient-to-br ${a.color} text-white border border-stone-200/60 rounded-2xl text-xs md:text-sm font-semibold cursor-pointer transition-all shadow-sm hover:shadow-md`}
          >
            <motion.span whileHover={{ scale: 1.15, rotate: 8 }}>
              {a.icon}
            </motion.span>
            <span className="line-clamp-1">{a.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SellerDashboard;