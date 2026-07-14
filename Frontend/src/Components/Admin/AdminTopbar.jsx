import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Bell, Search, ShieldCheck } from "lucide-react";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/sellers": "Seller Management",
  "/admin/users": "User Management",
  "/admin/products": "Product Catalog",
  "/admin/categories": "Categories",
};

const AdminTopbar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "Admin";

  return (
    <header className="h-16 border-b border-white/5 bg-[#0D1117]/80 backdrop-blur-xl flex items-center px-6 gap-4 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
      >
        <Menu size={16} />
      </button>

      <div className="flex-1">
        <p className="text-white/80 text-sm font-semibold">{title}</p>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={13} className="absolute left-3 text-white/25 pointer-events-none" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-white/5 border border-white/8 text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-52 focus:outline-none focus:border-amber-500/40 focus:bg-white/8 placeholder-white/20 transition-all"
        />
      </div>

      {/* Notif */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
      >
        <Bell size={15} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 border border-[#0D1117]" />
      </motion.button>

      {/* Admin avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
        <ShieldCheck size={14} className="text-white" />
      </div>
    </header>
  );
};

export default AdminTopbar;