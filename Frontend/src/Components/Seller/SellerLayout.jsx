import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, Store, LogOut } from "lucide-react";
import SellerSidebar from "../../Components/Seller/SellerSidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { clearStorage } from "../../Localstorage/storage";
import API from "../../utils/axios";
import toast from "react-hot-toast";

const breadcrumbMap = {
  "/seller": ["Overview"],
  "/seller/categories": ["Categories", "All Categories"],
  "/seller/categories/new": ["Categories", "Add New"],
  "/seller/products": ["Products", "All Products"],
  "/seller/products/new": ["Products", "Add New"],
  "/seller/orders": ["Orders"],
  "/seller/analytics": ["Analytics"],
};

const SellerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user || {});
  const userName = user?.name || "";

  const crumbs = breadcrumbMap[location.pathname] || ["Dashboard"];
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPendingOrders = async () => {
    try {
      const res = await API.get("/api/order/seller");
      const responseData = res.data?.data || res.data?.orders || res.data;
      const ordersArray = Array.isArray(responseData) ? responseData : [];

      const pendingCount = ordersArray.filter(
        (order) => order.status !== "delivered" && order.status !== "cancelled",
      ).length;

      setPendingOrdersCount(pendingCount);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPendingOrders();

    // Set up polling interval - refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPendingOrders();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Optional: Also refresh when returning to tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchPendingOrders();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());
      clearStorage();
      toast.success("Logged out successfully");
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleNotificationClick = () => {
    navigate("/seller/orders");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-800">
      <SellerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-stone-200/40 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 text-xs font-semibold text-stone-500"
          >
            <motion.div
              whileHover={{ scale: 1.1, color: "#15803d" }}
              className="cursor-pointer transition-colors"
            >
              <Store size={14} className="text-green-700" />
            </motion.div>
            <span className="text-stone-400">Aura Botanicals</span>
            {crumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <motion.div whileHover={{ x: 2 }} className="text-stone-300">
                  <ChevronRight size={12} />
                </motion.div>
                <motion.span
                  className={`${
                    i === crumbs.length - 1 ? "text-stone-800 font-bold" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {crumb}
                </motion.span>
              </React.Fragment>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.button
              onClick={handleNotificationClick}
              whileTap={{ scale: 0.92 }}
              whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
              className="relative p-2.5 rounded-2xl hover:bg-green-50/60 text-stone-500 hover:text-green-700 transition-all cursor-pointer"
              title="View Pending Orders"
            >
              <Bell size={16} className="text-stone-600" />
              {pendingOrdersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {pendingOrdersCount}
                </motion.span>
              )}
            </motion.button>

            <div className="hidden sm:block w-px h-6 bg-stone-200/50" />

            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 8px 24px rgba(22, 101, 52, 0.2)",
                }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 text-white text-xs font-bold flex items-center justify-center cursor-pointer select-none shadow-md transition-shadow"
                title="User Menu"
              >
                {userName?.charAt(0).toUpperCase()}
                {userName?.split(" ")[1]?.charAt(0).toUpperCase()}
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 bg-white border border-stone-200/60 rounded-xl shadow-lg z-50 min-w-[220px] overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-gradient-to-br from-green-900 to-green-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {userName?.charAt(0).toUpperCase()}
                            {userName?.split(" ")[1]?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {userName}
                            </p>
                            <p className="text-[10px] text-green-300 capitalize tracking-wide">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <motion.button
                          whileHover={{
                            x: 3,
                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                          }}
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <LogOut size={15} />
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
