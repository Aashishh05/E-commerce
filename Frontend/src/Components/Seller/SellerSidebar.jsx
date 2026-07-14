import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Tag,
  ChevronRight,
  ChevronDown,
  Leaf,
  LogOut,
  List,
  Plus,
  Settings,
} from "lucide-react";

const navItems = [
  {
    key: "overview",
    label: "Overview",
    icon: <LayoutDashboard size={16} />,
    path: "/seller-dashboard",
  },
  {
    key: "category",
    label: "Categories",
    icon: <Tag size={16} />,
    children: [
      { label: "All Categories", icon: <List size={14} />, path: "/category-list" },
      { label: "Add Category", icon: <Plus size={14} />, path: "/category-form" },
    ],
  },
  {
    key: "product",
    label: "Products",
    icon: <Package size={16} />,
    children: [
      { label: "All Products", icon: <List size={14} />, path: "/product-list" },
      { label: "Add Product", icon: <Plus size={14} />, path: "/product-form" },
    ],
  },
  {
    key: "order",
    label: "Orders",
    icon: <ShoppingCart size={16} />,
    path: "/order-list",
  },
 
];

const SellerSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({ category: true, product: true });

  const toggleGroup = (key) => {
    if (collapsed) return;
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isGroupActive = (children) =>
    children?.some((c) => location.pathname === c.path);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="shrink-0 bg-white border-r border-stone-200/60 flex flex-col h-screen sticky top-0 overflow-hidden z-20 shadow-sm"
    >
      {/* ── Logo Section ── */}
      <div className="flex items-center gap-3 px-4 h-20 border-b border-stone-100/80 bg-gradient-to-br from-green-50/50 to-transparent">
        <motion.div
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white shrink-0 shadow-lg"
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Leaf size={18} />
        </motion.div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="font-serif font-bold text-stone-900 text-sm leading-tight whitespace-nowrap">
                Aura Store
              </p>
              <p className="text-[10px] text-green-700 font-semibold uppercase tracking-widest whitespace-nowrap">
                Portal
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2.5 py-5 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          /* ── Single Navigation Link ── */
          if (!item.children) {
            const active = location.pathname === item.path;
            return (
              <NavLink key={item.key} to={item.path} className="no-underline">
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-r from-green-700 to-green-800 text-white shadow-md"
                        : "text-stone-600 hover:text-stone-800 hover:bg-stone-100/60"
                    }`}
                  >
                    <motion.span
                      className="shrink-0 relative z-10"
                      whileHover={{ rotate: 8, scale: 1.1 }}
                    >
                      {item.icon}
                    </motion.span>
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="sidebarHighlight"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600/20 to-transparent -z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            );
          }

          /* ── Collapsible Group ── */
          const groupActive = isGroupActive(item.children);
          const isOpen = openGroups[item.key] && !collapsed;

          return (
            <div key={item.key}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleGroup(item.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  groupActive
                    ? "text-green-700 bg-green-50/80"
                    : "text-stone-600 hover:text-stone-800 hover:bg-stone-100/60"
                }`}
              >
                <motion.span
                  className="shrink-0"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                >
                  {item.icon}
                </motion.span>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-left whitespace-nowrap font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="chevron"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: isOpen ? 180 : 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-stone-400"
                    >
                      <ChevronDown size={14} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Sub-items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mt-1"
                  >
                    <div className="ml-2.5 pt-1 pb-2 pl-4 border-l-2 border-green-200/60 space-y-1">
                      {item.children.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <NavLink key={child.path} to={child.path} className="no-underline">
                            {({ isActive }) => (
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer group ${
                                  isActive
                                    ? "bg-green-700 text-white shadow-sm"
                                    : "text-stone-500 hover:bg-green-50/60 hover:text-green-700"
                                }`}
                              >
                                <motion.span
                                  className="shrink-0"
                                  whileHover={{ scale: 1.15 }}
                                >
                                  {child.icon}
                                </motion.span>
                                <span className="whitespace-nowrap font-medium">
                                  {child.label}
                                </span>
                              </motion.div>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="p-3 border-t border-stone-100/80 space-y-2 bg-gradient-to-t from-green-50/30 to-transparent">
        {/* Seller Avatar */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="avatar-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/50 border border-stone-100/50 mb-2"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
                AS
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold text-stone-800 whitespace-nowrap truncate">
                  Aashish Shrestha
                </p>
                <p className="text-[10px] text-green-700 font-medium whitespace-nowrap">
                  Verified Seller
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50/60 text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut size={14} className="shrink-0" />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="logout"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgba(120,113,108,0.1)" }}
          className="w-full flex items-center justify-center p-2.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100/60 transition-all cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <ChevronRight size={14} />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default SellerSidebar;