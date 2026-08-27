import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Tag,
  Package,
  FileText,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Bell,
  CheckCircle2,
  Truck,
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

const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return { color: "amber", label: "Pending" };
    case "confirmed":
      return { color: "blue", label: "Confirmed" };
    case "processing":
      return { color: "blue", label: "Processing" };
    case "shipped":
      return { color: "purple", label: "Shipped" };
    case "delivered":
      return { color: "green", label: "Delivered" };
    case "cancelled":
      return { color: "red", label: "Cancelled" };
    default:
      return { color: "stone", label: status };
  }
};

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/api/product/getall");
      setProducts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await API.get("/api/category/getall");
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/api/order/seller");
      const responseData = res.data?.data || res.data?.orders || res.data;
      const ordersArray = Array.isArray(responseData) ? responseData : [];
      setOrders(ordersArray);

      const newMessages = ordersArray
        .filter((order) =>
          ["confirmed", "shipped", "delivered"].includes(order.status),
        )
        .map((order) => ({
          id: `${order._id}-${order.status}`,
          orderId: order._id,
          status: order.status,
          customer:
            order.buyer?.name || order.shippingAddress?.fullName || "Customer",
          createdAt: order.updatedAt || order.createdAt,
        }));

      setMessages(newMessages);
    } catch (err) {
      if (!err._isHandled) {
        console.error("Error fetching orders:", err);
      }
    }
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchProducts(), fetchCategories(), fetchOrders()]);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchProducts, fetchCategories, fetchOrders]);

  const totalSales = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, order) => {
      const itemsList = order.orderItems || order.items || [];
      const orderTotal = itemsList.reduce(
        (s, item) => s + item.price * item.quantity,
        0,
      );
      return sum + orderTotal;
    }, 0);

  const deliveredOrdersCount = orders.filter(
    (o) => o.status === "delivered",
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-700"
        />
        <p className="mt-4 text-sm font-semibold text-stone-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8 px-4"
    >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={fadeUp} className="lg:col-span-1 space-y-5">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">
                  Total Sales
                </p>
                <p className="text-sm text-green-600">From delivered orders</p>
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <TrendingUp className="text-green-700" size={24} />
              </motion.div>
            </div>
            <p className="text-4xl font-serif font-bold text-green-900 mt-2">
              Rs. {Number(totalSales).toFixed(0)}
            </p>
            <p className="text-xs text-green-600 mt-3 font-medium">
              {deliveredOrdersCount} delivered order
              {deliveredOrdersCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-stone-600">
                Total Products
              </p>
              <Package className="text-green-700" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">
              {products.length}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              {products.filter((p) => p.status === "active").length} active
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-stone-600">Categories</p>
              <Tag className="text-blue-700" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">
              {categories.length}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              {categories.filter((c) => c.isActive).length} active
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-stone-600">Total Orders</p>
              <FileText className="text-amber-700" size={20} />
            </div>
            <p className="text-3xl font-bold text-stone-900">{orders.length}</p>
            <p className="text-xs text-stone-500 mt-2">
              {orders.filter((o) => o.status === "delivered").length} delivered
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-stone-200 px-6 py-4 flex items-center gap-2">
              <Bell size={18} className="text-blue-700" />
              <div>
                <h2 className="font-semibold text-stone-900 text-lg">
                  Order Updates
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Status notifications from confirmed orders
                </p>
              </div>
            </div>

            <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.slice(0, 8).map((msg, idx) => {
                    const statusCfg = getStatusConfig(msg.status);
                    const StatusIcon =
                      msg.status === "delivered"
                        ? CheckCircle2
                        : msg.status === "shipped"
                          ? Truck
                          : FileText;

                    const statusMessages = {
                      confirmed: `Order confirmed from ${msg.customer}`,
                      shipped: `Order shipped to ${msg.customer}`,
                      delivered: `Order delivered to ${msg.customer} ✓`,
                    };

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 hover:bg-${statusCfg.color}-50 transition-colors border-l-4 border-${statusCfg.color}-400`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 p-2 rounded-lg bg-${statusCfg.color}-50 text-${statusCfg.color}-600`}
                          >
                            <StatusIcon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900">
                              {statusMessages[msg.status]}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-1 rounded-full bg-${statusCfg.color}-50 text-${statusCfg.color}-700`}
                              >
                                {statusCfg.label}
                              </span>
                              <p className="text-[11px] text-stone-400">
                                {msg.createdAt
                                  ? new Intl.DateTimeFormat("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(new Date(msg.createdAt))
                                  : "Just now"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-stone-500">
                    <p className="text-sm">No updates yet</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm">
            <div className="border-b border-stone-200 px-6 py-4">
              <h2 className="font-semibold text-stone-900 text-lg">
                Recent Activity
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Latest updates from your store
              </p>
            </div>

            <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {orders.length > 0 ? (
                  orders.slice(0, 8).map((order, idx) => {
                    const customer =
                      order.buyer?.name ||
                      order.customer ||
                      order.shippingAddress?.fullName ||
                      "Guest";
                    const itemsList = order.orderItems || order.items || [];
                    const totalAmount = itemsList.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0,
                    );

                    return (
                      <motion.div
                        key={order._id || order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                              order.status === "delivered"
                                ? "bg-green-500"
                                : order.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">
                              {customer} placed an order
                            </p>
                            <p className="text-xs text-stone-500 mt-1">
                              Rs. {Number(totalAmount).toFixed(2)} •{" "}
                              <span className="capitalize">{order.status}</span>
                            </p>
                            <p className="text-[11px] text-stone-400 mt-1">
                              {order.createdAt
                                ? new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(new Date(order.createdAt))
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-stone-500">
                    <p className="text-sm">No orders yet. Keep promoting!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={fadeUp}
          className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-900">Products</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {products.length} total
              </p>
            </div>
            <Package size={18} className="text-green-700" />
          </div>
          <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
            {products.length > 0 ? (
              products.slice(0, 6).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="px-6 py-3 hover:bg-stone-50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/product-form/${product._id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate group-hover:text-green-700 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Rs. {product.price?.toFixed(0) || "0"} •{" "}
                        <span
                          className={`font-medium ${
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock || 0} stock
                        </span>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                        product.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {product.status || "Active"}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-stone-500">
                <p className="text-sm">No products yet</p>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ backgroundColor: "rgb(249 250 251)" }}
            onClick={() => navigate("/product-list")}
            className="w-full px-6 py-3 text-sm font-medium text-green-700 border-t border-stone-200 hover:bg-stone-50 transition-colors"
          >
            View all products →
          </motion.button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-900">Categories</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {categories.length} total
              </p>
            </div>
            <Tag size={18} className="text-blue-700" />
          </div>
          <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((category, idx) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="px-6 py-3 hover:bg-stone-50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/category-form/${category._id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate group-hover:text-blue-700 transition-colors">
                        {category.name}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {category.productsCount || 0} products
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                        category.isActive
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-stone-500">
                <p className="text-sm">No categories yet</p>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ backgroundColor: "rgb(249 250 251)" }}
            onClick={() => navigate("/category-list")}
            className="w-full px-6 py-3 text-sm font-medium text-blue-700 border-t border-stone-200 hover:bg-stone-50 transition-colors"
          >
            View all categories →
          </motion.button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-900">Orders</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {orders.length} total
              </p>
            </div>
            <FileText size={18} className="text-amber-700" />
          </div>
          <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
            {orders.length > 0 ? (
              orders.slice(0, 6).map((order, idx) => {
                const customer =
                  order.buyer?.name ||
                  order.customer ||
                  order.shippingAddress?.fullName ||
                  "Guest";
                const itemsList = order.orderItems || order.items || [];
                const totalAmount = itemsList.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                );

                return (
                  <motion.div
                    key={order._id || order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="px-6 py-3 hover:bg-stone-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      navigate(`/seller/orders/${order.id || order._id}`)
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate group-hover:text-amber-700 transition-colors">
                          {customer}
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                          Rs. {Number(totalAmount).toFixed(0)} •{" "}
                          {itemsList.length} item
                          {itemsList.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                          order.status === "delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status === "cancelled"
                              ? "bg-red-50 text-red-600"
                              : order.status === "shipped"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-6 py-8 text-center text-stone-500">
                <p className="text-sm">No orders yet</p>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ backgroundColor: "rgb(249 250 251)" }}
            onClick={() => navigate("/order-list")}
            className="w-full px-6 py-3 text-sm font-medium text-amber-700 border-t border-stone-200 hover:bg-stone-50 transition-colors"
          >
            View all orders →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SellerDashboard;
