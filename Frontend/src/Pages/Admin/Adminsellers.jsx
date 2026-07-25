import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ShieldBan,
  ShieldCheck,
  Search,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import API from "../../utils/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      delay: i * 0.05,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },

  approved: {
    label: "Approved",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },

  blocked: {
    label: "Blocked",
    cls: "bg-red-500/15 text-red-400 border-red-500/20",
  },

  rejected: {
    label: "Rejected",
    cls: "bg-white/8 text-white/30 border-white/10",
  },
};

const FILTERS = ["All", "Pending", "Approved", "Blocked", "Rejected"];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={`
      inline-flex items-center 
      px-2.5 py-1 rounded-lg 
      border text-[10px]
      font-bold uppercase 
      tracking-wider
      ${cfg.cls}
      `}
    >
      {cfg.label}
    </span>
  );
};

const AdminSellers = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/admin/sellers/${id}`, {
        status,
      });

      setSellers((prev) =>
        prev.map((seller) =>
          seller._id === id
            ? {
                ...seller,
                verificationStatus: status,
                isVerified: status === "approved",
              }
            : seller,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Update seller error:", err);

      setError("Failed to update seller status");
    }
  };

  const handleBlockSeller = async (id) => {
    try {
      await API.put(`/api/admin/block-seller/${id}`);

      setSellers((prev) =>
        prev.map((seller) =>
          seller._id === id
            ? {
                ...seller,

                verificationStatus:
                  seller.verificationStatus === "blocked"
                    ? "approved"
                    : "blocked",

                isBlocked: seller.verificationStatus !== "blocked",
              }
            : seller,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Block seller error:", err);

      setError("Failed to block seller");
    }
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/api/admin/sellers");

      setSellers(res.data.data.sellers || []);
    } catch (err) {
      console.error("Fetch seller error:", err);

      setError("Error fetching sellers");

      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredSellers = sellers.filter((seller) => {
    const matchesFilter =
      filter === "All" ||
      seller.verificationStatus?.toLowerCase() === filter.toLowerCase();

    const matchesSearch =
      seller.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      seller.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      seller.user?.email?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSellers = filteredSellers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const counts = {
    All: sellers.length,

    Pending: sellers.filter((s) => s.verificationStatus === "pending").length,

    Approved: sellers.filter((s) => s.verificationStatus === "approved").length,

    Blocked: sellers.filter((s) => s.verificationStatus === "blocked").length,

    Rejected: sellers.filter((s) => s.verificationStatus === "rejected").length,
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  return (
    <div className="space-y-6">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1
          className="
          text-white text-2xl 
          font-bold tracking-tight 
          flex items-center gap-2.5
          "
        >
          <Store size={20} className="text-amber-400" />
          Seller Management
        </h1>

        <p className="text-white/30 text-sm mt-1">
          Approve, block, or reject sellers on the platform
        </p>
      </motion.div>

      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
        flex flex-col sm:flex-row 
        items-start sm:items-center 
        gap-4
        "
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 
                rounded-lg text-xs 
                font-semibold transition-all border

                ${
                  filter === f
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-white/5 text-white/35 border-white/8 hover:text-white/60 hover:bg-white/8"
                }

                `}
            >
              {f}

              <span className="ml-1.5 text-[10px] opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <Search
            size={12}
            className="
            absolute left-3 top-1/2 
            -translate-y-1/2 
            text-white/25
            "
          />

          <input
            type="text"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            bg-white/5 
            border border-white/8 
            text-white/70 
            text-xs rounded-xl 
            pl-8 pr-4 py-2 
            w-48
            focus:outline-none
            "
          />
        </div>
      </motion.div>

      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
        rounded-2xl 
        border border-white/8 
        bg-[#161B27] 
        overflow-hidden
        "
      >
        <div
          className="
          grid 
          grid-cols-[1fr_1fr_72px_96px_140px]
          items-center 
          px-5 py-3 
          border-b border-white/8
          text-[10px]
          font-bold
          uppercase
          tracking-widest
          text-white/25
          "
        >
          <span>Seller</span>

          <span className="hidden md:block">Email</span>

          <span className="text-center">Sales</span>

          <span>Status</span>

          <span className="text-right">Actions</span>
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div
              className="
              py-14 
              text-center 
              text-white/20 
              text-sm
              "
            >
              Loading sellers...
            </div>
          ) : error ? (
            <div
              className="
              py-14 
              text-center 
              text-red-400/60 
              text-sm
              "
            >
              {error}
            </div>
          ) : filteredSellers.length === 0 ? (
            <div
              className="
              py-14 
              text-center 
              text-white/20 
              text-sm
              "
            >
              No sellers found.
            </div>
          ) : (
            paginatedSellers.map((seller, i) => (
              <motion.div
                key={seller._id}
                layout
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 10,
                }}
                transition={{
                  duration: 0.28,
                  delay: i * 0.04,
                }}
                className="
                grid
                grid-cols-[1fr_1fr_72px_96px_140px]
                items-center
                px-5 py-4
                border-b
                border-white/5
                last:border-0
                hover:bg-white/[0.025]
                transition-colors
                relative
                "
              >
                <div
                  className="
                  flex items-center 
                 gap-3 min-w-0
                  "
                >
                  <div
                    className="
                    w-8 h-8 
                    rounded-xl 
                    bg-gradient-to-br 
                    from-amber-500/20 
                    to-orange-500/10 
                    border border-amber-500/15
                    text-amber-400
                    text-xs
                    font-bold
                    flex items-center
                    justify-center
                    shrink-0
                    "
                  >
                    {seller.shopName?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                      text-white/80 
                      text-xs 
                      font-semibold 
                      truncate
                      "
                    >
                      {seller.shopName}
                    </p>

                    <p
                      className="
                      text-white/25 
                      text-[10px]
                      truncate
                      md:hidden
                      "
                    >
                      {seller.user?.email || "No email"}
                    </p>

                    <p
                      className="
                      text-white/25 
                      text-[10px]
                      "
                    >
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p
                  className="
                  text-white/35 
                  text-xs 
                  truncate 
                  hidden md:block 
                  pr-4
                  "
                >
                  {seller.user?.email || "No email"}
                </p>

                <p
                  className="
                  text-white/50 
                  text-xs 
                  font-mono 
                  text-center
                  "
                >
                  {seller.totalSales}
                </p>

                <StatusBadge status={seller.verificationStatus} />

                <div
                  className="
                  flex items-center 
                  justify-end 
                  gap-1.5
                  "
                >
                  {seller.verificationStatus === "pending" && (
                    <>
                      <motion.button
                        whileHover={{
                          scale: 1.07,
                        }}
                        whileTap={{
                          scale: 0.93,
                        }}
                        onClick={() => updateStatus(seller._id, "approved")}
                        title="Approve"
                        className="
                    w-7 h-7
                    rounded-lg
                    bg-emerald-500/15
                    border border-emerald-500/20
                    text-emerald-400
                    flex items-center
                    justify-center
                    "
                      >
                        <CheckCircle2 size={13} />
                      </motion.button>

                      <motion.button
                        whileHover={{
                          scale: 1.07,
                        }}
                        whileTap={{
                          scale: 0.93,
                        }}
                        onClick={() => updateStatus(seller._id, "rejected")}
                        title="Reject"
                        className="
                    w-7 h-7
                    rounded-lg
                    bg-red-500/10
                    border border-red-500/15
                    text-red-400
                    flex items-center
                    justify-center
                    "
                      >
                        <XCircle size={13} />
                      </motion.button>
                    </>
                  )}

                  {seller.verificationStatus === "approved" && (
                    <motion.button
                      whileHover={{
                        scale: 1.07,
                      }}
                      whileTap={{
                        scale: 0.93,
                      }}
                      onClick={() => handleBlockSeller(seller._id)}
                      className="
                    flex items-center
                    gap-1.5
                    px-2.5
                    h-7
                    rounded-lg
                    bg-red-500/10
                    border border-red-500/15
                    text-red-400
                    text-[10px]
                    font-bold
                    "
                    >
                      <ShieldBan size={12} />
                      Block
                    </motion.button>
                  )}

                  {(seller.verificationStatus === "blocked" ||
                    seller.verificationStatus === "rejected") && (
                    <motion.button
                      whileHover={{
                        scale: 1.07,
                      }}
                      whileTap={{
                        scale: 0.93,
                      }}
                      onClick={() => updateStatus(seller._id, "approved")}
                      className="
                    flex items-center
                    gap-1.5
                    px-2.5
                    h-7
                    rounded-lg
                    bg-emerald-500/15
                    border border-emerald-500/20
                    text-emerald-400
                    text-[10px]
                    font-bold
                    "
                    >
                      <ShieldCheck size={12} />
                      Reapprove
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {filteredSellers.length > 0 && (
          <div
            className="
            flex items-center 
            justify-between 
            px-5 py-4 
            border-t border-white/8
            bg-white/[0.02]
            "
          >
            <div className="text-white/25 text-xs">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredSellers.length)} of{" "}
              {filteredSellers.length}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="
                w-8 h-8
                rounded-lg
                bg-white/5
                border border-white/8
                text-white/35
                disabled:opacity-40
                disabled:cursor-not-allowed
                flex items-center
                justify-center
                hover:bg-white/10
                transition-all
                "
              >
                <ChevronLeft size={14} />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`
                    w-8 h-8
                    rounded-lg
                    text-xs
                    font-semibold
                    border
                    transition-all

                    ${
                      currentPage === page
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-white/5 text-white/35 border-white/8 hover:bg-white/10"
                    }
                    `}
                  >
                    {page}
                  </motion.button>
                ),
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="
                w-8 h-8
                rounded-lg
                bg-white/5
                border border-white/8
                text-white/35
                disabled:opacity-40
                disabled:cursor-not-allowed
                flex items-center
                justify-center
                hover:bg-white/10
                transition-all
                "
              >
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminSellers;
