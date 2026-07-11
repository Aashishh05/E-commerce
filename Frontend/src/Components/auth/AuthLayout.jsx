import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex font-sans bg-cream">

      {/* Left branding panel */}
      <div className="hidden lg:flex w-[460px] shrink-0 relative bg-forest items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3A2E] via-[#3A5240] to-[#2C3A2E]" />

        <svg
          className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-[0.07]"
          width="420" height="420" viewBox="0 0 320 320" fill="none"
        >
          <path d="M160 10 C220 10 310 80 310 160 C310 240 240 310 160 310 C80 310 10 240 10 160 C10 80 100 10 160 10Z" stroke="#8FA67A" strokeWidth="1" fill="none" />
          <path d="M160 40 C210 40 280 100 280 160 C280 220 220 280 160 280 C100 280 40 220 40 160 C40 100 110 40 160 40Z" stroke="#8FA67A" strokeWidth="0.7" fill="none" />
          <path d="M160 10 L160 310" stroke="#8FA67A" strokeWidth="0.5" />
          <path d="M10 160 L310 160" stroke="#8FA67A" strokeWidth="0.5" />
          <path d="M50 50 L270 270" stroke="#8FA67A" strokeWidth="0.3" />
          <path d="M270 50 L50 270" stroke="#8FA67A" strokeWidth="0.3" />
        </svg>

        <div className="relative z-10 px-14 text-center max-w-sm">
          <Link to="/" className="inline-block mb-10">
            <div className="font-serif text-2xl font-semibold tracking-[0.12em] text-cream uppercase">
              Aura
              <span className="block text-[9px] font-sans font-light tracking-[0.35em] text-sage-mid mt-[-2px]">
                Botanicals
              </span>
            </div>
          </Link>

          <p className="text-[10px] tracking-[0.3em] text-sage-mid uppercase mb-5">
            Pure · Sustainable · Botanical
          </p>
          <h2 className="font-serif text-[42px] font-light text-cream leading-[1.12] mb-5">
            Your ritual,{" "}
            <em className="italic text-clay">reimagined</em>
          </h2>
          <p className="text-sm text-sage-mid font-light leading-relaxed">
            Sign in to track orders, save favourites, and unlock member-only rituals crafted just for you.
          </p>

          <div className="mt-10 pt-8 border-t border-[rgba(246,242,236,0.08)] text-[11px] text-sage-mid italic font-serif">
            Est. 2018 · Pure &amp; Sustainable
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <div className="font-serif text-xl font-semibold tracking-[0.12em] text-forest uppercase">
                Aura
                <span className="block text-[9px] font-sans font-light tracking-[0.35em] text-text-muted mt-[-1px]">
                  Botanicals
                </span>
              </div>
            </Link>
          </div>

          <Outlet />
        </motion.div>
      </div>

    </div>
  );
};

export default AuthLayout;