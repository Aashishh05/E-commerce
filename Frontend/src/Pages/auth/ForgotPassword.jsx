import { useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbMail, TbArrowLeft, TbCheck } from "react-icons/tb";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast"; 
import API from "../../utils/axios";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      const response = await API.post("http://localhost:5000/api/auth/forgot-password", values);


      toast.success(response.data.message || "Reset code sent!", {
        duration: 3000,
        style: {
          background: "#223026",
          color: "#FAFAF8",
          fontSize: "13px",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#A4B494",
          secondary: "#223026",
        },
      });

      setSubmitted(true);

      setTimeout(() => {
        navigate("/verify-otp", { state: { email: values.email } });
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to send code. Please try again.";
      setError(message);

      toast.error(message, {
        duration: 4000,
        style: {
          background: "#FFEBEE",
          color: "#EF5350",
          border: "1px solid #EF5350",
          fontSize: "13px",
          borderRadius: "8px",
        },
      });
    } finally {
      setSubmitting(false);
    }
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

  if (submitted) {
    return (
      <motion.div
        className="w-full flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <motion.div className="mb-4" variants={itemVariants}>
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A4B494]/20 to-[#E7C59B]/20 flex items-center justify-center mx-auto mb-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TbCheck className="w-8 h-8 text-[#A4B494]" />
          </motion.div>

          <h1 className="font-serif text-2xl text-[#223026] font-light mb-2">
            Check Email
          </h1>

          <p className="text-xs text-[#7A8B7E] font-light leading-relaxed">
            We've sent a code to your email. Check your inbox and spam folder.
          </p>
        </motion.div>

        <motion.p
          className="text-[10px] text-gray-500 mt-4 font-light"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Redirecting...
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
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div variants={itemVariants} className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#A4B494] hover:text-[#223026] transition font-light"
        >
          <TbArrowLeft size={14} />
          Back
        </Link>
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants}>
        <p className="uppercase tracking-[0.35em] text-[9px] text-[#A4B494] font-semibold">
          Password Recovery
        </p>

        <h1 className="font-serif text-3xl text-[#223026] font-light mt-2 leading-tight">
          Forgot Password?
        </h1>

        <p className="text-xs text-[#7A8B7E] mt-2 leading-relaxed font-light">
          Enter your email and we'll send a code.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg border border-[#EF5350] bg-[#FFEBEE]/20 text-[#EF5350] text-xs font-light text-center"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="w-full">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, getFieldProps, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Email
                </label>

                <motion.div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition-all duration-300 shadow-sm ${
                    touched.email && errors.email
                      ? "border-[#EF5350] bg-[#FFEBEE]/20"
                      : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F] focus-within:bg-white/60"
                  }`}
                  whileFocus={{ scale: 1.01 }}
                >
                  <div
                    className={`flex-shrink-0 ${
                      touched.email && errors.email
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }`}
                  >
                    <TbMail size={16} />
                  </div>

                  <input
                    type="email"
                    {...getFieldProps("email")}
                    className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm leading-tight"
                    placeholder="you@example.com"
                  />
                </motion.div>

                {touched.email && errors.email && (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="bg-[#A4B494]/5 border border-[#A4B494]/20 rounded-lg p-3"
                variants={itemVariants}
              >
                <p className="text-[11px] text-[#7A8B7E] leading-relaxed font-semibold">
                  Check your spam folder if you don't see the code.
                </p>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-[#D8B98F] via-[#E9D3AE] to-[#D8B98F] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                variants={itemVariants}
              >
                {isSubmitting && (
                  <motion.div
                    className="w-3.5 h-3.5 border-2 border-[#223026] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {isSubmitting ? "Sending..." : "Send Code"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>

      <motion.p
        className="text-center text-xs text-[#7A8B7E] mt-4 font-light"
        variants={itemVariants}
      >
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-green-800 hover:underline transition"
        >
          Sign In
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default ForgotPassword;