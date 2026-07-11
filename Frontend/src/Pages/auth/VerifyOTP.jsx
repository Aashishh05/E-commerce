import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TbArrowLeft, TbRefresh } from "react-icons/tb";

const RESEND_DELAY = 60;

const VerifyOTP = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = () => {
    // TODO: dispatch resendOTP thunk
    setOtp(Array(6).fill(""));
    setTimer(RESEND_DELAY);
    setCanResend(false);
    inputs.current[0]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;
    // TODO: dispatch verifyOTP thunk
    console.log("OTP:", code);
  };

  const filled = otp.join("").length === 6;

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-sage uppercase font-medium mb-1">
          Verification
        </p>
        <h2 className="font-serif text-[32px] font-light text-forest leading-tight">
          Enter OTP
        </h2>
        <div className="w-8 h-px bg-clay mt-3 mb-5" />
        <p className="text-sm text-text-muted font-light leading-relaxed">
          A 6-digit code has been sent to your email. Enter it below to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block text-[11px] tracking-[0.15em] uppercase text-forest-mid font-medium mb-4">
          Verification Code
        </label>

        <div className="flex gap-2.5 mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-full aspect-square text-center text-lg font-medium text-forest bg-[#FAFAF7] border rounded-sm outline-none transition-colors duration-200 ${
                digit ? "border-sage" : "border-[#E2DDD6] focus:border-sage"
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!filled}
          className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60"
        >
          Verify Code
        </button>
      </form>

      <div className="mt-7 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="inline-flex items-center gap-1.5 text-xs text-sage hover:text-forest transition-colors font-medium"
          >
            <TbRefresh size={13} />
            Resend Code
          </button>
        ) : (
          <p className="text-xs text-text-muted">
            Resend code in{" "}
            <span className="text-forest font-medium">{timer}s</span>
          </p>
        )}
      </div>

      <Link
        to="/forgot-password"
        className="flex items-center justify-center gap-2 mt-5 text-xs text-text-muted hover:text-forest transition-colors"
      >
        <TbArrowLeft size={14} />
        Back
      </Link>
    </>
  );
};

export default VerifyOTP;