import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ShieldBan,
  ShieldCheck,
  Mail,
  Loader,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../utils/axios.js";

const LIMIT = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/api/admin/users", {
        params: {
          page,
          limit: LIMIT,
          search: search || undefined,
          status: filter === "All" ? undefined : filter.toLowerCase(),
        },
      });
      console.log(res.data.data.users);

      setUsers(res.data.data.users);
      setPagination({
        total: res.data.totalUsers ?? 0,
        pages: res.data.totalPages ?? 1,
      });
    } catch {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filter, page]);

  const handleToggle = async (user) => {
    try {
      setTogglingId(user._id);
      await API.put(`/api/admin/toggle-user/${user._id}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: !u.isActive } : u,
        ),
      );

      toast.success(`User ${user.isActive ? "blocked" : "unblocked"}`);
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  if (loading && users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader className="text-blue-400" size={32} />
        </motion.div>
        <p className="text-white/40 text-sm mt-4">Loading users...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h3 className="text-white font-bold mb-2">Something went wrong</h3>
        <p className="text-white/40 text-sm mb-6 max-w-xs">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchUsers}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/20 font-semibold"
        >
          <RefreshCw size={16} /> Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white text-2xl font-bold flex items-center gap-2.5">
          <Users size={20} className="text-blue-400" /> User Management
        </h1>
        <p className="text-white/30 text-sm mt-1">
          Block or unblock users — {pagination.total} total
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-1.5">
          {["All", "Active", "Blocked"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${filter === f ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-white/5 text-white/35 border-white/[0.08] hover:text-white/60 hover:bg-white/[0.08]"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/[0.08] text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-52 focus:outline-none focus:border-blue-500/40 placeholder-white/20 transition-all"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/[0.08] bg-[#161B27] overflow-hidden"
      >
        <div className="grid grid-cols-[1fr_1fr_60px_90px_100px] items-center px-5 py-3 border-b border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-white/25">
          <span>User</span>
          <span className="hidden md:block">Email</span>
          <span className="text-center">Orders</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-400" size={24} />
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="py-16 text-center text-white/20 text-sm">
            No users found.
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {!loading &&
            users.map((user, i) => {
              const isToggling = togglingId === user._id;
              return (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isToggling ? 0.5 : 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="grid grid-cols-[1fr_1fr_60px_90px_100px] items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${user.isActive ? "bg-blue-500/15 border border-blue-500/20 text-blue-400" : "bg-white/5 border border-white/10 text-white/30"}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-xs font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-white/25 text-[10px]">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 min-w-0">
                    <Mail size={11} className="text-white/20 shrink-0" />
                    <p className="text-white/35 text-xs truncate pr-4">
                      {user.email}
                    </p>
                  </div>

                  <p className="text-white/50 text-xs font-mono text-center">
                    {user.orders ?? 0}
                  </p>

                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase w-fit ${user.isActive ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-red-500/15 text-red-400 border-red-500/20"}`}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </span>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleToggle(user)}
                      disabled={isToggling}
                      className={`flex items-center gap-1.5 px-2.5 h-7 rounded-lg border text-[10px] font-bold transition-all disabled:opacity-40 ${user.isActive ? "bg-red-500/10 border-red-500/15 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"}`}
                    >
                      {isToggling ? (
                        <Loader size={11} className="animate-spin" />
                      ) : user.isActive ? (
                        <>
                          <ShieldBan size={11} /> Block
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={11} /> Unblock
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </motion.div>

      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between text-xs text-white/30"
        >
          <span>
            Page {page} of {pagination.pages} — {pagination.total} users
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1 || loading}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/50"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const num =
                pagination.pages <= 5
                  ? i + 1
                  : page <= 3
                    ? i + 1
                    : page >= pagination.pages - 2
                      ? pagination.pages - 4 + i
                      : page - 2 + i;
              return (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  disabled={loading}
                  className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${num === page ? "border-blue-500/30 bg-blue-500/20 text-blue-400" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"}`}
                >
                  {num}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.pages || loading}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/50"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsers;
