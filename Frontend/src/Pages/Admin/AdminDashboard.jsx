import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import API from "../../utils/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.07,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const StatCard = ({ label, value, sub, icon: Icon, accent, i }) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#161B27] p-6 group"
  >
    <div
      className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl"
      style={{ background: accent }}
    />

    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest">
          {label}
        </p>
        <p className="text-white text-3xl font-bold mt-2 font-mono tracking-tight">
          {value}
        </p>
        <p className="text-white/30 text-xs mt-1">{sub}</p>
      </div>

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
        }}
      >
        <Icon size={17} style={{ color: accent }} />
      </div>
    </div>
  </motion.div>
);

const PendingSellerRow = ({ seller, i, onApprove, onReject }) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
      {seller.shopName?.[0]?.toUpperCase() || "S"}
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-white/80 text-xs font-semibold truncate">
        {seller.shopName}
      </p>
      <p className="text-white/30 text-[10px] truncate">{seller.user?.email}</p>
    </div>

    <span className="text-[10px] text-white/25 hidden sm:block">
      {new Date(seller.createdAt).toLocaleDateString()}
    </span>

    <div className="flex items-center gap-1.5 shrink-0">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => onApprove(seller._id)}
        title="Approve seller"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold hover:bg-emerald-500/25 transition-colors"
      >
        <CheckCircle2 size={11} />
        Approve
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => onReject(seller._id)}
        title="Reject seller"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/15 text-[10px] font-bold hover:bg-red-500/20 transition-colors"
      >
        <XCircle size={11} />
        Reject
      </motion.button>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    orderStatus: {},
    sellers: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const statsRes = await API.get("/api/admin/dashboard");
      const stats = statsRes.data?.data || {};
      const sellersRes = await API.get("/api/admin/sellers");
      const allSellers = sellersRes.data?.data?.sellers || [];

      const approvedSellers = allSellers.filter(
        (s) => s.verificationStatus === "approved",
      );
      const pendingSellers = allSellers.filter(
        (s) => s.verificationStatus === "pending",
      );

      setDashboardData({
        totalUsers: stats.totalUsers || 0,
        totalSellers: approvedSellers.length || 0,
        pendingSellers: pendingSellers.length || 0,
        totalProducts: stats.totalProducts || 0,
        totalCategories: stats.totalCategories || 0,
        totalOrders: stats.totalOrders || 0,
        totalRevenue: stats.totalRevenue || 0,
        orderStatus: stats.orderStatus || {},
        sellers: pendingSellers.slice(0, 4),
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveSeller = async (sellerId) => {
    try {
      await API.put(`/api/admin/sellers/${sellerId}`, {
        status: "approved",
      });

      setDashboardData((prev) => ({
        ...prev,
        sellers: prev.sellers.filter((s) => s._id !== sellerId),
        pendingSellers: Math.max(0, prev.pendingSellers - 1),
        totalSellers: prev.totalSellers + 1,
      }));
    } catch (err) {
      console.error("Error approving seller:", err);
      setError("Failed to approve seller");
    }
  };

  const handleRejectSeller = async (sellerId) => {
    try {
      await API.put(`/api/admin/sellers/${sellerId}`, {
        status: "rejected",
      });

      setDashboardData((prev) => ({
        ...prev,
        sellers: prev.sellers.filter((s) => s._id !== sellerId),
        pendingSellers: Math.max(0, prev.pendingSellers - 1),
      }));
    } catch (err) {
      console.error("Error rejecting seller:", err);
      setError("Failed to reject seller");
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      sub: "Active buyers on platform",
      icon: Users,
      accent: "#60a5fa",
    },
    {
      label: "Active Sellers",
      value: dashboardData.totalSellers.toString(),
      sub: `${dashboardData.pendingSellers} pending approval`,
      icon: Store,
      accent: "#f59e0b",
    },
    {
      label: "Products Listed",
      value: dashboardData.totalProducts.toLocaleString(),
      sub: "Total items in catalog",
      icon: ShoppingBag,
      accent: "#a78bfa",
    },
    {
      label: "Total Revenue",
      value: `$${(dashboardData.totalRevenue / 1000).toFixed(1)}k`,
      sub: "From delivered orders",
      icon: DollarSign,
      accent: "#34d399",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/40 text-sm">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={13} className="text-amber-500" />
          <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
            {dashboardData.pendingSellers} items need attention
          </span>
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
          Control Center
        </h1>

        <p className="text-white/35 text-sm mt-1">
          Platform overview ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            sub={stat.sub}
            icon={stat.icon}
            accent={stat.accent}
            i={index}
          />
        ))}
      </div>

      {Object.keys(dashboardData.orderStatus).length > 0 && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-white/8 bg-[#161B27] p-6"
        >
          <h2 className="text-white/90 text-sm font-bold flex items-center gap-2 mb-4">
            <TrendingUp size={13} className="text-blue-400" />
            Order Status Breakdown
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(dashboardData.orderStatus).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="flex flex-col items-center p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <p className="text-white text-xl font-bold font-mono">
                    {count}
                  </p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1 text-center">
                    {status}
                  </p>
                </div>
              ),
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-white/8 bg-[#161B27] overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h2 className="text-white/90 text-sm font-bold flex items-center gap-2">
              <Clock size={13} className="text-amber-400" />
              Pending Seller Verifications
            </h2>
            <p className="text-white/30 text-[11px] mt-0.5">
              Approve or reject new seller applications
            </p>
          </div>

          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => navigate("/admin/sellers")}
            className="text-[11px] text-amber-400 font-bold flex items-center gap-1 hover:text-amber-300 transition-colors"
          >
            View all
            <ChevronRight size={12} />
          </motion.button>
        </div>

        <div>
          {dashboardData.sellers.length === 0 ? (
            <div className="py-8 text-center text-white/25 text-sm">
              No pending sellers at the moment
            </div>
          ) : (
            dashboardData.sellers.map((seller, index) => (
              <PendingSellerRow
                key={seller._id}
                seller={seller}
                i={index + 5}
                onApprove={handleApproveSeller}
                onReject={handleRejectSeller}
              />
            ))
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
