import React, { useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { clearStorage } from "../../Localstorage/storage";

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
      { label: "Sellers", icon: Store, to: "/admin/sellers" },
      { label: "Users", icon: Users, to: "/admin/users" },
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

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel, isLoading }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 rounded-2xl border border-white/10 bg-[#161B27] shadow-xl"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
              <AlertCircle size={18} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Sign out?</h3>
              <p className="text-white/30 text-xs mt-0.5">
                You'll be logged out of admin panel
              </p>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-white/50 text-sm">
              Are you sure you want to sign out? You'll need to log in again to
              access the admin dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2 px-6 py-4 border-t border-white/8 bg-white/[0.02]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/70 font-medium text-sm hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <LogOut size={14} />
                  </motion.div>
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  Sign out
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user || {});

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      dispatch(logout());
      clearStorage();

      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <motion.aside
        animate={{ width: open ? 256 : 64 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 h-screen bg-[#111827] border-r border-white/5 flex flex-col z-40 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/admin-dashboard")}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-900/30 cursor-pointer transition-transform"
          >
            <Leaf size={15} className="text-amber-950 fill-amber-950" />
          </motion.div>

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
                  Aura MarketPlace
                </p>
                <p className="text-amber-500 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                  Admin Panel
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
            title={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft size={13} className="text-white/50" />
          </motion.button>
        </div>

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
                              isActive
                                ? "text-amber-400"
                                : "text-white/30 group-hover:text-white/60"
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

        <div className="px-2 pb-4 space-y-2 shrink-0 border-t border-white/5 pt-4">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 font-bold text-xs text-white">
                  {user.name?.[0]?.toUpperCase() || "A"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-semibold truncate">
                    {user.name || "Admin"}
                  </p>
                  <p className="text-white/30 text-[10px] truncate">
                    {user.email || "admin@aura.com"}
                  </p>
                </div>

                <ShieldCheck size={13} className="text-amber-400 shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title="Sign out from admin panel"
          >
            <LogOut size={15} className="shrink-0" />
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default AdminSidebar;
