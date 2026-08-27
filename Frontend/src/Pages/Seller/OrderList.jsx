import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  Download,
  Package,
  Hash,
} from "lucide-react";
import API from "../../utils/axios";

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

const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return { color: "amber", icon: Clock, label: "Pending" };
    case "confirmed":
      return { color: "blue", icon: FileText, label: "Confirmed" };
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
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const StatusPriority = {
  pending: 1,
  confirmed: 2,
  processing: 3,
  shipped: 4,
  delivered: 6,
  cancelled: 5,
};

const OrderList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/order/seller");
        const responseData = res.data?.data || res.data?.orders || res.data;
        setOrders(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        if (!error._isHandled) {
          toast.error(
            error.response?.data?.message || "Failed to fetch seller orders"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const handleStatusUpdate = async (
    orderId,
    newStatus,
    trackingNumber = ""
  ) => {
    try {
      setUpdatingOrderId(orderId);
      await API.put(`/api/order/update/${orderId}`, {
        status: newStatus,
        trackingNumber: newStatus === "shipped" ? trackingNumber : undefined,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
      setOpenMenu(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const orderId = String(o.orderId || o._id || "");
    const customerName = String(
      o.buyer?.name || o.customer || o.shippingAddress?.fullName || ""
    );
    const customerEmail = String(o.email || o.customerEmail || "");

    const matchesSearch =
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort orders: pending/confirmed/processing first, then shipped, cancelled, delivered last
  const sortedOrders = [...filtered].sort((a, b) => {
    const priorityA = StatusPriority[a.status] || 0;
    const priorityB = StatusPriority[b.status] || 0;
    return priorityA - priorityB;
  });

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
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
          {[
            "all",
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].map((status) => (
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

      <motion.div variants={stagger} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-stone-400 border border-stone-200 rounded-3xl bg-white/40 backdrop-blur-sm"
            >
              <p className="font-semibold text-stone-600 text-center">
                Loading orders...
              </p>
            </motion.div>
          ) : sortedOrders.length > 0 ? (
            sortedOrders.map((order) => {
              const orderId = order._id;
              const orderNumber = order.orderId || `#${order._id?.slice(-8).toUpperCase()}`;
              const customerName =
                order.buyer?.name ||
                order.customer ||
                order.shippingAddress?.fullName ||
                "Guest Customer";
              const statusCfg = getStatusConfig(order.status);
              const StatusIcon = statusCfg.icon;

              const itemsList = order.orderItems || order.items || [];

              const totalAmount = itemsList.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              let productName = order.productName || order.product?.name;
              if (!productName && itemsList.length > 0) {
                const firstItem = itemsList[0];
                productName =
                  firstItem.name || firstItem.product?.name || firstItem.title;
                if (itemsList.length > 1) {
                  productName = `${productName} + ${itemsList.length - 1} more`;
                }
              }
              productName = productName || "Various Products";

              const orderDate = order.date || order.createdAt;
              const availableTransitions = validTransitions[order.status] || [];

              return (
                <motion.div
                  key={orderId}
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
                  className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all group relative"
                >
                  <div className="flex items-center gap-5 min-w-[250px]">
                    <div
                      className={`p-3 rounded-xl bg-${statusCfg.color}-50 text-${statusCfg.color}-600`}
                    >
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash size={14} className="text-stone-400" />
                        <p className="text-xs font-bold text-stone-500 tracking-wider">
                          {orderNumber}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-stone-600">
                        {customerName}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[180px] flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1">
                      <Package size={10} /> Product
                    </p>
                    <p
                      className="text-sm font-semibold text-stone-800 truncate"
                      title={productName}
                    >
                      {productName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-20 min-w-[180px]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1">
                        <Calendar size={10} /> Date
                      </p>
                      <p className="text-sm text-stone-700 font-medium">
                        {orderDate ? formatDate(orderDate) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                        Items
                      </p>
                      <p className="text-sm text-stone-700 font-medium">
                        {itemsList.length || 1} product
                        {itemsList.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 min-w-[220px]">
                    <div className="flex flex-col items-start md:items-end">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-2 mb-1.5 ${
                          order.status === "delivered"
                            ? "text-green-700 bg-green-50 border-green-200/60"
                            : order.status === "cancelled"
                              ? "text-red-700 bg-red-50 border-red-200/60"
                              : order.status === "processing"
                                ? "text-blue-700 bg-blue-50 border-blue-200/60"
                                : order.status === "confirmed"
                                  ? "text-blue-700 bg-blue-50 border-blue-200/60"
                                  : order.status === "shipped"
                                    ? "text-purple-700 bg-purple-50 border-purple-200/60"
                                    : "text-amber-700 bg-amber-50 border-amber-200/60"
                        }`}
                      >
                        {statusCfg.label}
                      </span>
                      <p className="text-lg font-serif font-bold text-stone-900">
                        Rs.{Number(totalAmount).toFixed()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(22, 101, 52, 0.08)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/seller/orders/${orderId}`)}
                        className="p-2.5 text-green-700 border-2 border-green-200/60 rounded-xl hover:border-green-700 bg-green-50/40 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </motion.button>

                      <div className="relative">
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(28, 25, 23, 0.05)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setOpenMenu(openMenu === orderId ? null : orderId)
                          }
                          disabled={
                            order.status === "cancelled" ||
                            order.status === "delivered"
                          }
                          className={`p-2.5 border-2 rounded-xl transition-all cursor-pointer ${
                            order.status === "cancelled" ||
                            order.status === "delivered"
                              ? "text-stone-300 border-stone-200/40 cursor-not-allowed opacity-50"
                              : "text-stone-500 border-stone-200/60 hover:border-stone-400 hover:text-stone-700"
                          }`}
                          title="More Actions"
                        >
                          <MoreVertical size={16} />
                        </motion.button>

                        <AnimatePresence>
                          {openMenu === orderId &&
                            order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 mt-2 bg-white border border-stone-200/60 rounded-xl shadow-lg z-50 min-w-[180px] overflow-hidden"
                              >
                                {availableTransitions.length > 0 ? (
                                  <div className="py-1">
                                    {availableTransitions.map((nextStatus) => (
                                      <motion.button
                                        key={nextStatus}
                                        whileHover={{
                                          backgroundColor:
                                            "rgba(22, 101, 52, 0.05)",
                                        }}
                                        onClick={() =>
                                          handleStatusUpdate(
                                            orderId,
                                            nextStatus
                                          )
                                        }
                                        disabled={updatingOrderId === orderId}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                                      >
                                        {nextStatus === "cancelled"
                                          ? "🚫 Cancel Order"
                                          : `Update to ${nextStatus}`}
                                      </motion.button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="px-4 py-3 text-xs text-stone-500 font-medium">
                                    No actions available
                                  </div>
                                )}
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </div>
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