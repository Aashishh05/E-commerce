import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();

  return (
    // Full screen background with subtle ambient color
    <div className="h-screen w-screen flex items-center justify-center bg-[#F7F6F2] relative overflow-hidden select-none p-4 sm:p-8">
      
      {/* Background Ambient Orbs */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#E8D0B0]/30 blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#C8D3C3]/30 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      {/* The Main Centered Floating Card */}
      <motion.div 
        className="w-full max-w-[1000px] h-full max-h-[700px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex overflow-hidden relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        {/* ================= LEFT PANEL (Card Image/Brand - 45%) ================= */}
        <div className="hidden md:flex flex-col justify-between w-[45%] relative overflow-hidden bg-gradient-to-br from-[#223026] via-[#304438] to-[#1F2A22] p-10">
          
          {/* Subtle overlay textures */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#435E4A_0%,transparent_70%)]" />
          <svg className="absolute inset-0 opacity-[0.02] mix-blend-multiply" width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/">
              <h1 className="text-2xl font-serif text-white tracking-widest font-light">NOVA</h1>
              <p className="uppercase tracking-[0.4em] text-[9px] text-[#C8D3C3] mt-1 font-light">Marketplace</p>
            </Link>
          </div>

          {/* Center Graphic / Text */}
          <div className="relative z-10 my-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-[#D9E5D1] text-[9px] uppercase tracking-[0.2em] mb-4">
              Premium Selection
            </span>
            <h2 className="font-serif text-4xl leading-[1.2] text-white font-light mb-4">
              Curated items <br />
              <span className="italic text-[#E7C59B]">for modern living.</span>
            </h2>
            <p className="text-[#C8D3C3]/80 leading-relaxed text-xs font-light max-w-xs">
              Join thousands discovering premium products. Fast, secure, and delightful.
            </p>
          </div>

          {/* Bottom Trust Badges */}
          <div className="relative z-10 flex gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-lg font-serif text-[#E7C59B]">100%</p>
              <p className="text-[9px] text-[#C8D3C3] uppercase tracking-wider mt-1">Secure</p>
            </div>
            <div>
              <p className="text-lg font-serif text-[#E7C59B]">24/7</p>
              <p className="text-[9px] text-[#C8D3C3] uppercase tracking-wider mt-1">Support</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL (Form Area - 55%) ================= */}
        <div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 sm:px-14 py-8 relative">
          
          {/* Mobile Logo (Only shows on small screens) */}
          <div className="md:hidden text-center mb-6">
            <Link to="/">
              <h1 className="text-2xl font-serif tracking-widest text-[#223026] font-light">NOVA</h1>
            </Link>
          </div>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm mx-auto"
          >
            {/* The routed form (Register/Login) injects here */}
            <Outlet />
          </motion.div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;