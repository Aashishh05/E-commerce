import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ShieldBan,
  ShieldCheck,
  Search,
  Filter,
  Store,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const INIT_SELLERS = [
  { id: 1, name: "Green Roots Co.", email: "greenroots@email.com", products: 0, joined: "Jul 12 2026", status: "pending" },
  { id: 2, name: "Bloom & Co.", email: "bloom@co.com", products: 24, joined: "Jun 01 2026", status: "approved" },
  { id: 3, name: "Herbal Nest", email: "herbalnest@mail.com", products: 0, joined: "Jul 13 2026", status: "pending" },
  { id: 4, name: "Pure Flora", email: "pureflora@shop.com", products: 0, joined: "Jul 10 2026", status: "pending" },
  { id: 5, name: "Earth & Sage", email: "earthsage@store.com", products: 41, joined: "Apr 14 2026", status: "approved" },
  { id: 6, name: "Wild Bloom Studio", email: "wildbloom@studio.io", products: 0, joined: "Jul 09 2026", status: "pending" },
  { id: 7, name: "Roots & Ritual", email: "rootsritual@co.com", products: 18, joined: "May 20 2026", status: "blocked" },
  { id: 8, name: "Purely Botanical", email: "purely@botanicals.com", products: 33, joined: "Mar 03 2026", status: "approved" },
];

const STATUS_CONFIG = {
  pending:  { label: "Pending",  cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  approved: { label: "Approved", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  blocked:  { label: "Blocked",  cls: "bg-red-500/15 text-red-400 border-red-500/20" },
  rejected: { label: "Rejected", cls: "bg-white/8 text-white/30 border-white/10" },
};

const FILTERS = ["All", "Pending", "Approved", "Blocked", "Rejected"];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
};

const AdminSellers = () => {
  const [sellers, setSellers] = useState(INIT_SELLERS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const updateStatus = (id, status) => {
    setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    setOpenMenu(null);
  };

  const filtered = sellers.filter((s) => {
    const matchFilter = filter === "All" || s.status === filter.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: sellers.length,
    Pending: sellers.filter((s) => s.status === "pending").length,
    Approved: sellers.filter((s) => s.status === "approved").length,
    Blocked: sellers.filter((s) => s.status === "blocked").length,
    Rejected: sellers.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-white text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <Store size={20} className="text-amber-400" />
          Seller Management
        </h1>
        <p className="text-white/30 text-sm mt-1">
          Approve, block, or reject sellers on the platform
        </p>
      </motion.div>

      {/* Filter tabs + search */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filter === f
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-white/5 text-white/35 border-white/8 hover:text-white/60 hover:bg-white/8"
              }`}
            >
              {f}
              <span className="ml-1.5 text-[10px] opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/8 text-white/70 text-xs rounded-xl pl-8 pr-4 py-2 w-48 focus:outline-none focus:border-amber-500/40 placeholder-white/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-white/8 bg-[#161B27] overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_72px_96px_140px] items-center px-5 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-white/25">
          <span>Seller</span>
          <span className="hidden md:block">Email</span>
          <span className="text-center">Products</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="py-14 text-center text-white/20 text-sm">No sellers match your filter.</div>
          ) : (
            filtered.map((seller, i) => (
              <motion.div
                key={seller.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                className="grid grid-cols-[1fr_1fr_72px_96px_140px] items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.025] transition-colors relative"
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/15 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {seller.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 text-xs font-semibold truncate">{seller.name}</p>
                    <p className="text-white/25 text-[10px] truncate md:hidden">{seller.email}</p>
                    <p className="text-white/25 text-[10px]">{seller.joined}</p>
                  </div>
                </div>

                {/* Email */}
                <p className="text-white/35 text-xs truncate hidden md:block pr-4">{seller.email}</p>

                {/* Products */}
                <p className="text-white/50 text-xs font-mono text-center">{seller.products}</p>

                {/* Status */}
                <StatusBadge status={seller.status} />

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5">
                  {seller.status === "pending" && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => updateStatus(seller.id, "approved")}
                        title="Approve"
                        className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 flex items-center justify-center transition-all"
                      >
                        <CheckCircle2 size={13} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => updateStatus(seller.id, "rejected")}
                        title="Reject"
                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
                      >
                        <XCircle size={13} />
                      </motion.button>
                    </>
                  )}

                  {seller.status === "approved" && (
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => updateStatus(seller.id, "blocked")}
                      title="Block seller"
                      className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all"
                    >
                      <ShieldBan size={12} />
                      Block
                    </motion.button>
                  )}

                  {(seller.status === "blocked" || seller.status === "rejected") && (
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => updateStatus(seller.id, "approved")}
                      title="Reinstate seller"
                      className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25 transition-all"
                    >
                      <ShieldCheck size={12} />
                      Reinstate
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminSellers;