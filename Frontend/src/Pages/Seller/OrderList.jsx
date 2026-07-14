import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MoreVertical,
  Calendar,
  Download
} from "lucide-react";

// ── Mock Order Data ──
const mockOrders = [
  {
    id: "ORD-902-XK",
    customer: "Eleanor Harper",
    email: "eleanor.h@example.com",
    date: "2026-07-14T09:24:00Z",
    total: 133.50,
    items: 2,
    status: "processing",
    payment: "paid",
  },
  {
    id: "ORD-901-PL",
    customer: "Marcus Chen",
    email: "m.chen88@example.com",
    date: "2026-07-13T14:45:00Z",
    total: 35.00,
    items: 1,
    status: "delivered",
    payment: "paid",
  },
  {
    id: "ORD-900-RT",
    customer: "Sarah Jenkins",
    email: "sarah.j@example.com",
    date: "2026-07-13T10:12:00Z",
    total: 245.00,
    items: 4,
    status: "shipped",
    payment: "paid",
  },
  {
    id: "ORD-899-BN",
    customer: "David Alaba",
    email: "dalaba.work@example.com",
    date: "2026-07-12T16:30:00Z",
    total: 85.50,
    items: 1,
    status: "pending",
    payment: "unpaid",
  },
  {
    id: "ORD-898-QM",
    customer: "Mia Wallace",
    email: "mia.w@example.com",
    date: "2026-07-11T08:15:00Z",
    total: 110.00,
    items: 2,
    status: "cancelled",
    payment: "refunded",
  },
];

// ── Animation Variants ──
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Helper Functions ──
const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return { color: "amber", icon: Clock, label: "Pending" };
    case "processing":
      return { color: "blue", icon: FileText, label: "Processing" };
    case "shipped":
      return { color: "purple", icon: Truck, label: "Shipped" };
    case "delivered":
      return { color: "green", icon: CheckCircle2, label: "Delivered" };
    case "cancelled":
      return { color: "red", icon: XCircle, label: "Cancelled" };
    default:
      return { color: "stone", icon: FileText, label: status };
  }
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const OrderList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [orders] = useState(mockOrders);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter(
    (o) =>
      (o.id.toLowerCase().includes(search.toLowerCase()) || 
       o.customer.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || o.status === statusFilter)
  );

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Header Section ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-green-700" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              Order Management
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Orders
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>
        <motion.button
          variants={fadeUp}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 12px 32px rgba(41, 37, 36, 0.15)",
          }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2.5 px-6 py-3 bg-white text-stone-700 border border-stone-200/60 text-sm font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer h-fit"
        >
          <Download size={16} />
          Export CSV
        </motion.button>
      </motion.div>

      {/* ── Search & Filter Section ── */}
      <motion.div variants={fadeUp} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <motion.div
            className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl px-5 py-3 focus-within:border-green-800/50 focus-within:ring-2 focus-within:ring-green-800/10 transition-all"
            whileFocus={{ scale: 1.01 }}
          >
            <Search size={15} className="text-stone-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer name…"
              className="outline-none bg-transparent text-sm w-full placeholder-stone-400 font-medium"
            />
          </motion.div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <motion.button
              key={status}
              onClick={() => setStatusFilter(status)}
              whileTap={{ scale: 0.95 }}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                statusFilter === status
                  ? "border-green-800 bg-green-50 text-green-800 shadow-sm"
                  : "border-stone-200/60 bg-white/50 text-stone-600 hover:border-green-300 hover:text-stone-800"
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Orders List ── */}
      <motion.div variants={stagger} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={order.id}
                  variants={fadeUp}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)",
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all group"
                >
                  {/* Left Column: ID & Customer */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className={`p-3 rounded-xl bg-${statusCfg.color}-50 text-${statusCfg.color}-600`}>
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm mb-0.5">
                        {order.id}
                      </h3>
                      <p className="text-sm font-medium text-stone-600">
                        {order.customer}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Date & Items */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1">
                        <Calendar size={10} /> Date
                      </p>
                      <p className="text-sm text-stone-700 font-medium">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                        Items
                      </p>
                      <p className="text-sm text-stone-700 font-medium">
                        {order.items} product{order.items > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Status & Price */}
                  <div className="flex items-center justify-between md:justify-end gap-6 min-w-[280px]">
                    <div className="flex flex-col items-start md:items-end">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-2 mb-1.5 ${
                        order.status === 'delivered' ? 'text-green-700 bg-green-50 border-green-200/60' :
                        order.status === 'processing' ? 'text-blue-700 bg-blue-50 border-blue-200/60' :
                        order.status === 'cancelled' ? 'text-red-700 bg-red-50 border-red-200/60' :
                        order.status === 'shipped' ? 'text-purple-700 bg-purple-50 border-purple-200/60' :
                        'text-amber-700 bg-amber-50 border-amber-200/60'
                      }`}>
                        {statusCfg.label}
                      </span>
                      <p className="text-lg font-serif font-bold text-stone-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(22, 101, 52, 0.08)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/seller/orders/${order.id}`)}
                        className="p-2.5 text-green-700 border-2 border-green-200/60 rounded-xl hover:border-green-700 bg-green-50/40 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(28, 25, 23, 0.05)" }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 text-stone-500 border-2 border-stone-200/60 rounded-xl hover:border-stone-400 hover:text-stone-700 bg-transparent transition-all cursor-pointer"
                        title="More Actions"
                      >
                        <MoreVertical size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-stone-400 border border-dashed border-stone-300 rounded-3xl bg-white/40 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mb-4 p-4 rounded-full bg-stone-100/60"
              >
                <FileText size={40} className="opacity-40" />
              </motion.div>
              <p className="font-semibold text-stone-600 text-center mb-2">
                No orders found
              </p>
              <p className="text-xs text-stone-500 text-center">
                {search
                  ? "Adjust your filters or search terms"
                  : "You haven't received any orders yet."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default OrderList;