import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Copy,
  ArrowRight,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../Components/auth/Navbar";
import Footer from "../../Components/auth/Footer";
import API from "../../utils/axios";
import toast from "react-hot-toast";

const Order = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      setError("Order ID not found");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/order/get/${orderId}`);
      
      if (res.data.success) {
        setOrder(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <LoaderCircle size={50} className="text-green-800 mx-auto" />
            </motion.div>
            <p className="text-gray-600 text-lg font-medium">
              Loading order details...
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md"
          >
            <AlertCircle size={50} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nav("/")}
              className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Success Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="mb-6"
          >
            <CheckCircle size={80} className="mx-auto text-green-600" />
          </motion.div>
          <h1 className="font-serif text-5xl font-bold text-stone-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-stone-600 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Order ID Card */}
              <motion.div variants={slideUp} className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-green-50 border border-green-200">
                    <Package size={24} className="text-green-800" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">
                    Order Details
                  </h2>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
                  <p className="text-sm text-green-700 font-semibold mb-2">
                    Order ID
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-green-900 font-mono">
                      {order.orderId}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyOrderId}
                      className="p-2 rounded-lg hover:bg-green-200 transition text-green-800"
                      title="Copy Order ID"
                    >
                      <Copy size={18} />
                    </motion.button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-700 mt-2 font-semibold">
                      ✓ Copied to clipboard
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-stone-600 font-semibold mb-1">
                      Order Date
                    </p>
                    <p className="font-semibold text-stone-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-600 font-semibold mb-1">
                      Status
                    </p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-bold text-sm rounded-full capitalize">
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-stone-600 font-semibold mb-1">
                      Payment Method
                    </p>
                    <p className="font-semibold text-stone-900 capitalize">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div variants={slideUp} className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-blue-50 border border-blue-200">
                    <Package size={24} className="text-blue-800" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">
                    Items Ordered
                  </h2>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 pb-4 border-b border-stone-200 last:border-b-0"
                    >
                      <div className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                        <img
                          src={item.image?.url || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-stone-600 mt-1">
                          Quantity: <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-stone-600">
                          Price:{" "}
                          <span className="font-semibold">
                            Rs.{item.price?.toFixed(2)}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-stone-600 mb-1">Subtotal</p>
                        <p className="font-bold text-stone-900 text-lg">
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div variants={slideUp} className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-orange-50 border border-orange-200">
                    <MapPin size={24} className="text-orange-800" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="bg-stone-50 rounded-lg p-6 border border-stone-200">
                  <p className="font-bold text-stone-900 mb-3">
                    {order.shippingAddress?.fullName}
                  </p>
                  <div className="space-y-2 text-sm text-stone-700">
                    <p>{order.shippingAddress?.address}</p>
                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </p>
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-stone-300">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-stone-600" />
                        <span>{order.shippingAddress?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-stone-600" />
                        <span>{order.shippingAddress?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Notes */}
              {order.notes && (
                <motion.div variants={slideUp} className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm">
                  <p className="text-sm font-semibold text-stone-600 mb-3">
                    Order Notes
                  </p>
                  <p className="text-stone-700 italic">{order.notes}</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm sticky top-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-stone-200">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Items ({totalItems})</span>
                  <span className="font-semibold">
                    Rs.
                    {order.orderItems
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-semibold">
                    {order.shippingPrice === 0
                      ? "Free"
                      : `Rs.${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Tax (10%)</span>
                  <span className="font-semibold">
                    Rs.
                    {((order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                      order.shippingPrice) *
                      0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-stone-900 mb-8">
                <span>Total</span>
                <span className="text-green-800">
                  Rs.{order.totalAmount?.toFixed(2)}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="mb-8 pb-8 border-b border-stone-200">
                <p className="text-xs font-bold text-stone-600 uppercase mb-4">
                  Delivery Status
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle size={16} className="text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Order Placed
                      </p>
                      <p className="text-xs text-stone-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        order.status !== "pending"
                          ? "bg-green-100"
                          : "bg-stone-100"
                      }`}
                    >
                      <CheckCircle
                        size={16}
                        className={
                          order.status !== "pending"
                            ? "text-green-700"
                            : "text-stone-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Confirmed
                      </p>
                      <p className="text-xs text-stone-600">
                        {order.status !== "pending"
                          ? formatDate(order.createdAt)
                          : "Awaiting confirmation"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        order.status === "shipped" || order.status === "delivered"
                          ? "bg-green-100"
                          : "bg-stone-100"
                      }`}
                    >
                      <Truck
                        size={16}
                        className={
                          order.status === "shipped" ||
                          order.status === "delivered"
                            ? "text-green-700"
                            : "text-stone-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Shipped
                      </p>
                      <p className="text-xs text-stone-600">
                        {order.status === "shipped" ||
                        order.status === "delivered"
                          ? formatDate(order.createdAt)
                          : "In progress"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        order.isDelivered ? "bg-green-100" : "bg-stone-100"
                      }`}
                    >
                      <CheckCircle
                        size={16}
                        className={
                          order.isDelivered
                            ? "text-green-700"
                            : "text-stone-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Delivered
                      </p>
                      <p className="text-xs text-stone-600">
                        {order.isDelivered
                          ? formatDate(order.deliveredAt)
                          : "Expected soon"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => nav("/orders")}
                  className="w-full py-3 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  View All Orders
                  <ArrowRight size={16} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => nav("/")}
                  className="w-full py-3 border-2 border-stone-300 text-stone-800 font-bold rounded-lg hover:bg-stone-50 transition"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Order;