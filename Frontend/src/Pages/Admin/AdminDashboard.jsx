import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  ShoppingBag,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ── Stat Card ── */
const StatCard = ({ label, value, sub, icon: Icon, accent, i }) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#161B27] p-6 group"
  >
    {/* subtle corner glow */}
    <div
      className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest">{label}</p>
        <p className="text-white text-3xl font-bold mt-2 font-mono tracking-tight">{value}</p>
        <p className="text-white/30 text-xs mt-1">{sub}</p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon size={17} style={{ color: accent }} />
      </div>
    </div>
  </motion.div>
);

/* ── Pending seller row ── */
const PendingRow = ({ seller, i }) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
      {seller.name[0]}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white/80 text-xs font-semibold truncate">{seller.name}</p>
      <p className="text-white/30 text-[10px] truncate">{seller.email}</p>
    </div>
    <span className="text-[10px] text-white/25 hidden sm:block">{seller.submitted}</span>
    <div className="flex items-center gap-1.5 shrink-0">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold hover:bg-emerald-500/25 transition-colors"
      >
        <CheckCircle2 size={11} />
        Approve
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/15 text-[10px] font-bold hover:bg-red-500/20 transition-colors"
      >
        <XCircle size={11} />
        Reject
      </motion.button>
    </div>
  </motion.div>
);

/* ── Activity item ── */
const Activity = ({ item, i }) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
  >
    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
    <div className="flex-1 min-w-0">
      <p className="text-white/60 text-xs">{item.text}</p>
      <p className="text-white/25 text-[10px] mt-0.5">{item.time}</p>
    </div>
  </motion.div>
);

/* ── Mock data ── */
const stats = [
  { label: "Total Users", value: "1,284", sub: "+24 this week", icon: Users, accent: "#60a5fa" },
  { label: "Active Sellers", value: "38", sub: "6 pending review", icon: Store, accent: "#f59e0b" },
  { label: "Products Listed", value: "412", sub: "19 added today", icon: ShoppingBag, accent: "#a78bfa" },
  { label: "Categories", value: "14", sub: "2 inactive", icon: Tag, accent: "#34d399" },
];

const pendingSellers = [
  { name: "Green Roots Co.", email: "greenroots@email.com", submitted: "2h ago" },
  { name: "Herbal Nest", email: "herbalnest@mail.com", submitted: "5h ago" },
  { name: "Pure Flora", email: "pureflora@shop.com", submitted: "Yesterday" },
  { name: "Wild Bloom Studio", email: "wildbloom@studio.io", submitted: "2 days ago" },
];

const recentActivity = [
  { text: "Seller 'Bloom & Co.' was approved by admin.", time: "12 min ago", dot: "bg-emerald-400" },
  { text: "User 'Priya N.' was blocked for suspicious activity.", time: "45 min ago", dot: "bg-red-400" },
  { text: "Product 'Rose Hip Serum' flagged for review.", time: "2h ago", dot: "bg-amber-400" },
  { text: "New category 'Aromatherapy' was created.", time: "3h ago", dot: "bg-blue-400" },
  { text: "Seller 'Pure Herb' submitted for verification.", time: "5h ago", dot: "bg-white/20" },
  { text: "User 'James K.' updated profile information.", time: "6h ago", dot: "bg-white/20" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={13} className="text-amber-500" />
          <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
            6 items need attention
          </span>
        </div>
        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
          Control Center
        </h1>
        <p className="text-white/35 text-sm mt-1">Platform overview · Tuesday, 14 July 2026</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} i={i} />
        ))}
      </div>

      {/* Pending Sellers + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Pending sellers */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="xl:col-span-3 rounded-2xl border border-white/8 bg-[#161B27] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div>
              <h2 className="text-white/90 text-sm font-bold flex items-center gap-2">
                <Clock size={13} className="text-amber-400" />
                Pending Verifications
              </h2>
              <p className="text-white/30 text-[11px] mt-0.5">Sellers awaiting approval</p>
            </div>
            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => navigate("/admin/sellers")}
              className="text-[11px] text-amber-400 font-bold flex items-center gap-1 hover:text-amber-300"
            >
              View all <ChevronRight size={12} />
            </motion.button>
          </div>
          <div>
            {pendingSellers.map((s, i) => (
              <PendingRow key={s.email} seller={s} i={i + 4} />
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="xl:col-span-2 rounded-2xl border border-white/8 bg-[#161B27] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-white/90 text-sm font-bold flex items-center gap-2">
              <TrendingUp size={13} className="text-blue-400" />
              Activity Log
            </h2>
          </div>
          <div className="px-5 py-2">
            {recentActivity.map((a, i) => (
              <Activity key={i} item={a} i={i + 5} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;