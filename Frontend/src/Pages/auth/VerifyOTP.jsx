import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TbArrowLeft, TbCheck, TbX } from "react-icons/tb";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("Verifying OTP:", otpCode);

      if (otpCode === "123456") {
        setVerified(true);

        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 1500);
      } else {
        setError("Invalid code. Try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    console.log("Resending OTP to:", email);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (verified) {
    return (
      <motion.div
        className="w-full flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mb-4" variants={itemVariants}>
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A4B494]/20 to-[#E7C59B]/20 flex items-center justify-center mx-auto mb-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TbCheck className="w-8 h-8 text-[#A4B494]" />
          </motion.div>

          <h1 className="font-serif text-2xl text-[#223026] font-light mb-2">
            Verified
          </h1>

          <p className="text-xs text-[#7A8B7E] font-light leading-relaxed">
            Code verified successfully. Redirecting...
          </p>
        </motion.div>

        <motion.p
          className="text-[10px] text-gray-500 mt-4 font-light"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Just a moment...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-1.5 text-xs text-[#A4B494] hover:text-[#223026] transition font-light"
        >
          <TbArrowLeft size={14} />
          Back
        </Link>
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants}>
        <p className="uppercase tracking-[0.35em] text-[9px] text-[#A4B494] font-semibold">
          Verification
        </p>

        <h1 className="font-serif text-3xl text-[#223026] font-light mt-2 leading-tight">
          Enter Code
        </h1>

        <p className="text-xs text-[#7A8B7E] mt-2 leading-relaxed font-light">
          6-digit code sent to your email.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <div>
          <div className="flex justify-center gap-2 mb-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-10 h-10 rounded-lg border-2 text-center text-lg font-semibold transition-all duration-300 focus:outline-none ${
                  error
                    ? "border-[#EF5350] text-[#EF5350] focus:border-[#EF5350]"
                    : "border-[#E8E3DB] text-[#223026] focus:border-[#D8B98F]"
                } bg-white/40 hover:shadow-lg focus:shadow-xl focus:bg-white/60`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
          </div>

          {error && (
            <motion.div
              className="flex items-center justify-center gap-1.5 text-[#EF5350] text-[9px] mb-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TbX size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <p className="text-[11px] text-[#A4B494] text-center font-semibold mb-4">
            Check spam folder too
          </p>

          <motion.button
            onClick={handleSubmit}
            disabled={isLoading || otp.some((digit) => !digit)}
            className="w-full h-10 rounded-lg bg-gradient-to-r from-[#D8B98F] via-[#E9D3AE] to-[#D8B98F] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isLoading && (
              <motion.div
                className="w-3.5 h-3.5 border-2 border-[#223026] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, linear: true }}
              />
            )}

            {isLoading ? "Verifying..." : "Verify"}
          </motion.button>

          <motion.div
            className="text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[11px] text-[#7A8B7E] mb-2 font-semibold">
              Didn't receive code?
            </p>

            <button
              onClick={handleResend}
              className="text-[#A4B494] hover:text-[#223026] font-semibold text-[12px] transition"
            >
              Resend
            </button>

            <p className="text-[11px] text-gray-400 mt-1.5 font-semibold">
              Code expires in 10 min
            </p>
          </motion.div>

        
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerifyOTP;
