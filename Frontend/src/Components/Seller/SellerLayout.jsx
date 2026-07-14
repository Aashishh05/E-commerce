import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, ChevronRight, Store, Menu } from "lucide-react";
import SellerSidebar from "../../Components/seller/SellerSidebar";

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
  const crumbs = breadcrumbMap[location.pathname] || ["Dashboard"];
  const [notifications] = React.useState(3);
  const [searchActive, setSearchActive] = React.useState(false);

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-800">
      <SellerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Premium Top Bar ── */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-stone-200/40 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          {/* Left: Breadcrumb Navigation */}
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
                <motion.div
                  whileHover={{ x: 2 }}
                  className="text-stone-300"
                >
                  <ChevronRight size={12} />
                </motion.div>
                <motion.span
                  className={`${i === crumbs.length - 1 ? "text-stone-800 font-bold" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {crumb}
                </motion.span>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Right: Actions */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Search Bar */}
            <motion.div
              animate={{ width: searchActive ? 240 : 180 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="flex items-center gap-2 bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200/70 rounded-2xl px-4 py-2.5 text-xs text-stone-600 focus-within:border-green-800/50 focus-within:ring-2 focus-within:ring-green-800/10 transition-all"
              >
                <Search size={13} className="text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => setSearchActive(true)}
                  onBlur={() => setSearchActive(false)}
                  className="bg-transparent outline-none w-full placeholder-stone-400 text-xs font-medium"
                />
              </div>
            </motion.div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-stone-200/50" />

            {/* Notifications Bell */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
              className="relative p-2.5 rounded-2xl hover:bg-green-50/60 text-stone-500 hover:text-green-700 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} className="text-stone-600" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg"
              >
                {notifications}
              </motion.span>
            </motion.button>

            {/* User Avatar */}
            <motion.div
              whileHover={{ scale: 1.08, boxShadow: "0 8px 24px rgba(22, 101, 52, 0.2)" }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 text-white text-xs font-bold flex items-center justify-center cursor-pointer select-none shadow-md transition-shadow"
            >
              AS
            </motion.div>
          </motion.div>
        </header>

        {/* ── Main Content Area ── */}
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