import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Store,
  ShieldCheck,
  LogOut,
  Leaf,
  ChevronLeft,
} from "lucide-react";

const NAV = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin-dashboard" },
    ],
  },
  {
    group: "People",
    items: [
      { label: "Sellers", icon: Store, to: "/admin/seller" },
      { label: "Users", icon: Users, to: "/admin/user" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { label: "Products", icon: ShoppingBag, to: "/admin/products" },
      { label: "Categories", icon: Tag, to: "/admin/categories" },
    ],
  },
];

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: open ? 256 : 64 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 h-screen bg-[#111827] border-r border-white/5 flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-900/30">
          <Leaf size={15} className="text-amber-950 fill-amber-950" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <p className="text-white font-bold text-sm tracking-wide leading-none">
                Aura Botanicals
              </p>
              <p className="text-amber-500 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                Admin Panel
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <motion.button
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
        >
          <ChevronLeft size={13} className="text-white/50" />
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
        {NAV.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {open && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25 px-3 mb-2"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/admin"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          : "text-white/40 hover:text-white/80 hover:bg-white/5"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={16}
                          className={`shrink-0 transition-colors ${
                            isActive ? "text-amber-400" : "text-white/30 group-hover:text-white/60"
                          }`}
                        />
                        <AnimatePresence>
                          {open && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.15 }}
                              className="truncate"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Admin badge + logout */}
      <div className="px-2 pb-4 space-y-2 shrink-0 border-t border-white/5 pt-4">
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={13} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">Super Admin</p>
              <p className="text-white/30 text-[10px] truncate">admin@aurabotanicals.com</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
        >
          <LogOut size={15} className="shrink-0" />
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;