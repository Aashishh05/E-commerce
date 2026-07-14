import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, ShieldBan, ShieldCheck, Mail } from "lucide-react";

const INIT_USERS = [
  { id: 1, name: "Sarah Mitchell",   email: "sarah.m@email.com",  orders: 12, joined: "Jan 08 2026", active: true },
  { id: 2, name: "James Keller",     email: "james.k@mail.com",   orders: 7,  joined: "Feb 19 2026", active: true },
  { id: 3, name: "Priya Nair",       email: "priya.n@inbox.com",  orders: 3,  joined: "Mar 30 2026", active: false },
  { id: 4, name: "Tom Walters",      email: "tom.w@email.com",    orders: 21, joined: "Nov 05 2025", active: true },
  { id: 5, name: "Anika Rao",        email: "anika.r@shop.com",   orders: 5,  joined: "Apr 12 2026", active: true },
  { id: 6, name: "Carlos Mendes",    email: "carlos.m@gmail.com", orders: 0,  joined: "Jun 22 2026", active: false },
  { id: 7, name: "Lily Chen",        email: "lily.c@email.com",   orders: 9,  joined: "Dec 01 2025", active: true },
  { id: 8, name: "Ravi Sharma",      email: "ravi.s@co.in",       orders: 4,  joined: "May 15 2026", active: true },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(INIT_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const toggle = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  const filtered = users.filter((u) => {
    const matchF =
      filter === "All" ||
      (filter === "Active" && u.active) ||
      (filter === "Blocked" && !u.active);
    const matchS =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const counts = {
    All: users.length,
    Active: users.filter((u) => u.active).length,
    Blocked: users.filter((u) => !u.active).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-white text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <Users size={20} className="text-blue-400" />
          User Management
        </h1>
        <p className="text-white/30 text-sm mt-1">Toggle user access across the platform</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.38 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-1.5">
          {["All", "Active", "Blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filter === f
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-white/5 text-white/35 border-white/8 hover:text-white/60 hover:bg-white/8"
              }`}
            >
              {f}
              <span className="ml-1.5 text-[10px] opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/8 text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-48 focus:outline-none focus:border-blue-500/40 placeholder-white/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-2xl border border-white/8 bg-[#161B27] overflow-hidden"
      >
        <div className="grid grid-cols-[1fr_1fr_60px_90px_100px] items-center px-5 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-white/25">
          <span>User</span>
          <span className="hidden md:block">Email</span>
          <span className="text-center">Orders</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="py-14 text-center text-white/20 text-sm">No users found.</div>
          ) : (
            filtered.map((user, i) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="grid grid-cols-[1fr_1fr_60px_90px_100px] items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                      user.active
                        ? "bg-blue-500/15 border border-blue-500/20 text-blue-400"
                        : "bg-white/5 border border-white/10 text-white/30"
                    }`}
                  >
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 text-xs font-semibold truncate">{user.name}</p>
                    <p className="text-white/25 text-[10px]">{user.joined}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="hidden md:flex items-center gap-1.5 min-w-0">
                  <Mail size={11} className="text-white/20 shrink-0" />
                  <p className="text-white/35 text-xs truncate pr-4">{user.email}</p>
                </div>

                {/* Orders */}
                <p className="text-white/50 text-xs font-mono text-center">{user.orders}</p>

                {/* Status */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider w-fit ${
                    user.active
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/15 text-red-400 border-red-500/20"
                  }`}
                >
                  {user.active ? "Active" : "Blocked"}
                </span>

                {/* Toggle */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggle(user.id)}
                    className={`flex items-center gap-1.5 px-2.5 h-7 rounded-lg border text-[10px] font-bold transition-all ${
                      user.active
                        ? "bg-red-500/10 border-red-500/15 text-red-400 hover:bg-red-500/20"
                        : "bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                    }`}
                  >
                    {user.active ? (
                      <><ShieldBan size={11} /> Block</>
                    ) : (
                      <><ShieldCheck size={11} /> Unblock</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminUsers;