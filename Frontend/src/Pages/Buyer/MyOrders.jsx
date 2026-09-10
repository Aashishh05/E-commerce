import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  Hash,
  AlertCircle,
  LoaderCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/auth/Navbar";
import Footer from "../../Components/auth/Footer";
import API from "../../utils/axios";
import toast from "react-hot-toast";

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e8e8e8' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

const statusSteps = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

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
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const MyOrders = () => {
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/api/order/get");
      const data = res.data?.data || res.data?.orders || res.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!error._isHandled) {
        setError(err.response?.data?.message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelModal) return;
    try {
      setCancelling(true);
      await API.delete(`/api/order/cancel/${cancelModal._id}`, {
        data: { cancelReason },
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === cancelModal._id ? { ...o, status: "cancelled" } : o,
        ),
      );
      toast.success("Order cancelled successfully");
      setCancelModal(null);
      setCancelReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const filtered = orders.filter(
    (o) => statusFilter === "all" || o.status === statusFilter,
  );

  const sortedOrders = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };

  const renderTimeline = (order) => {
    const currentIdx = statusSteps.indexOf(order.status);
    const isCancelled = order.status === "cancelled";

    return (
      <div className="space-y-0">
        {statusSteps.map((step, idx) => {
          const isCompleted = !isCancelled && idx <= currentIdx;
          const isCurrent = !isCancelled && idx === currentIdx;
          const config = getStatusConfig(step);
          const StepIcon = config.icon;

          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`p-1.5 rounded-full ${
                    isCompleted ? "bg-green-100" : "bg-stone-100"
                  }`}
                >
                  <StepIcon
                    size={14}
                    className={
                      isCompleted ? "text-green-700" : "text-stone-400"
                    }
                  />
                </div>
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`w-px h-6 ${
                      isCompleted && !isCurrent
                        ? "bg-green-300"
                        : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`text-xs font-semibold capitalize ${
                    isCompleted ? "text-stone-900" : "text-stone-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
        {isCancelled && (
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="p-1.5 rounded-full bg-red-100">
                <XCircle size={14} className="text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600">Cancelled</p>
              {order.cancelReason && (
                <p className="text-[10px] text-stone-500 mt-0.5">
                  {order.cancelReason}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="mb-8"
        >
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-green-800 hover:text-green-700 font-semibold mb-6"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="font-serif text-5xl font-bold text-stone-900">
            My Orders
          </h1>
          <p className="text-stone-600 mt-2 text-base font-semibold">
            Track and manage your orders
          </p>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="flex gap-2 overflow-x-auto pb-3 mb-6 hide-scrollbar"
        >
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
                  : "border-stone-200 bg-white/50 text-stone-600 hover:border-green-300 hover:text-stone-800"
              }`}
            >
              {status}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <LoaderCircle size={40} className="text-green-800" />
            </motion.div>
            <p className="text-stone-600 font-medium">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md"
            >
              <AlertCircle size={50} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-red-600 mb-2">
                Couldn't load orders
              </h2>
              <p className="text-stone-600 mb-6 text-sm">{error}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={fetchOrders}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition text-sm"
              >
                Try Again
              </motion.button>
            </motion.div>
          </div>
        ) : sortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[40vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <Package
                  size={64}
                  className="mx-auto text-green-800 opacity-40"
                />
              </motion.div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                {statusFilter === "all"
                  ? "No orders yet"
                  : `No ${statusFilter} orders`}
              </h2>
              <p className="text-stone-600 mb-8">
                {statusFilter === "all"
                  ? "Start shopping to see your orders here"
                  : "Try a different filter"}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => nav("/")}
                className="px-8 py-3 bg-green-800 text-white font-bold rounded-full hover:bg-green-700 transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Package size={18} />
                Start Shopping
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {sortedOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              const StatusIcon = statusCfg.icon;
              const items = order.orderItems || [];
              const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
              const isExpanded = expandedOrder === order._id;
              const canCancel = order.status === "pending";

              return (
                <motion.div
                  key={order._id}
                  variants={slideUp}
                  layout
                  className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order._id)
                    }
                  >
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div
                        className={`p-3 rounded-xl ${
                          order.status === "delivered"
                            ? "bg-green-50 text-green-600"
                            : order.status === "cancelled"
                              ? "bg-red-50 text-red-600"
                              : order.status === "shipped"
                                ? "bg-purple-50 text-purple-600"
                                : order.status === "processing" ||
                                    order.status === "confirmed"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        <StatusIcon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash size={13} className="text-stone-400" />
                          <p className="text-xs font-bold text-stone-500 tracking-wider">
                            {order.orderId ||
                              `#${order._id?.slice(-8).toUpperCase()}`}
                          </p>
                        </div>
                        <p className="text-sm text-stone-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-[140px]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                        Items
                      </p>
                      <p className="text-sm font-semibold text-stone-800 truncate">
                        {items.length > 0
                          ? items.length === 1
                            ? items[0].name
                            : `${items[0].name} + ${items.length - 1} more`
                          : "No items"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 min-w-[180px]">
                      <div className="flex flex-col items-start md:items-end">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-2 mb-1 ${
                            order.status === "delivered"
                              ? "text-green-700 bg-green-50 border-green-200"
                              : order.status === "cancelled"
                                ? "text-red-700 bg-red-50 border-red-200"
                                : order.status === "shipped"
                                  ? "text-purple-700 bg-purple-50 border-purple-200"
                                  : order.status === "processing" ||
                                      order.status === "confirmed"
                                    ? "text-blue-700 bg-blue-50 border-blue-200"
                                    : "text-amber-700 bg-amber-50 border-amber-200"
                          }`}
                        >
                          {statusCfg.label}
                        </span>
                        <p className="text-lg font-serif font-bold text-stone-900">
                          Rs.{Number(order.totalAmount).toFixed(2)}
                        </p>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={18} className="text-stone-400" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-stone-200 p-5 md:p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-5">
                              <div>
                                <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                                  <Package
                                    size={16}
                                    className="text-green-800"
                                  />
                                  Order Items
                                </h3>
                                <div className="space-y-3">
                                  {items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100"
                                    >
                                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0 border border-stone-200">
                                        <img
                                          src={item.image?.url || placeholder}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.src = placeholder;
                                          }}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-stone-900 truncate">
                                          {item.name}
                                        </p>
                                        <p className="text-xs text-stone-600 mt-0.5">
                                          Qty: {item.quantity} x Rs.
                                          {item.price?.toFixed(2)}
                                        </p>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-stone-900">
                                          Rs.
                                          {(item.price * item.quantity).toFixed(
                                            2,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                                  <MapPin
                                    size={16}
                                    className="text-green-800"
                                  />
                                  Shipping Address
                                </h3>
                                <div className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                                  <p className="font-semibold text-stone-900 text-sm mb-1">
                                    {order.shippingAddress?.fullName}
                                  </p>
                                  <p className="text-xs text-stone-700">
                                    {order.shippingAddress?.address}
                                  </p>
                                  <p className="text-xs text-stone-700">
                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state}
                                  </p>
                                  <div className="flex flex-col sm:flex-row gap-3 text-xs mt-3 pt-3 border-t border-stone-200">
                                    <span className="flex items-center gap-1.5 text-stone-600">
                                      <Mail size={12} />{" "}
                                      {order.shippingAddress?.email}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-stone-600">
                                      <Phone size={12} />{" "}
                                      {order.shippingAddress?.phone}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <div className="bg-stone-50 rounded-lg px-4 py-2 border border-stone-100">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                                    Payment
                                  </p>
                                  <p className="text-xs font-semibold text-stone-800 capitalize">
                                    {order.paymentMethod === "cod"
                                      ? "Cash on Delivery"
                                      : order.paymentMethod}
                                  </p>
                                </div>
                                <div className="bg-stone-50 rounded-lg px-4 py-2 border border-stone-100">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                                    Payment Status
                                  </p>
                                  <p className="text-xs font-semibold text-stone-800 capitalize">
                                    {order.paymentStatus}
                                  </p>
                                </div>
                                {order.trackingNumber && (
                                  <div className="bg-stone-50 rounded-lg px-4 py-2 border border-stone-100">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                                      Tracking
                                    </p>
                                    <p className="text-xs font-semibold text-stone-800 font-mono">
                                      {order.trackingNumber}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div>
                                <h3 className="text-sm font-bold text-stone-900 mb-3">
                                  Order Summary
                                </h3>
                                <div className="bg-stone-50 rounded-lg p-4 border border-stone-100 space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-stone-600">
                                      Items ({totalItems})
                                    </span>
                                    <span className="font-semibold">
                                      Rs.
                                      {items
                                        .reduce(
                                          (sum, i) =>
                                            sum + i.price * i.quantity,
                                          0,
                                        )
                                        .toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-stone-600">
                                      Shipping
                                    </span>
                                    <span className="font-semibold">
                                      {order.shippingPrice === 0
                                        ? "Free"
                                        : `Rs.${order.shippingPrice?.toFixed(2)}`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs font-bold pt-2 border-t border-stone-200">
                                    <span>Total</span>
                                    <span className="text-green-800">
                                      Rs.{order.totalAmount?.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-bold text-stone-900 mb-3">
                                  Delivery Progress
                                </h3>
                                <div className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                                  {renderTimeline(order)}
                                </div>
                              </div>

                              {canCancel && (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCancelModal(order);
                                  }}
                                  className="w-full py-2.5 bg-red-50 text-red-700 border-2 border-red-200 font-bold rounded-lg hover:bg-red-100 transition text-xs cursor-pointer"
                                >
                                  Cancel Order
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => {
              setCancelModal(null);
              setCancelReason("");
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
            >
              <div className="flex justify-center mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <XCircle size={28} className="text-red-600" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-stone-900 text-center">
                Cancel Order?
              </h2>
              <p className="mt-2 text-center text-sm text-stone-600">
                Order{" "}
                <span className="font-mono font-bold">
                  {cancelModal.orderId}
                </span>{" "}
                will be cancelled.
              </p>

              <div className="mt-5">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you're cancelling..."
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setCancelModal(null);
                    setCancelReason("");
                  }}
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Keep Order
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MyOrders;
