import { useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbMail, TbLock, TbEye, TbEyeOff } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast"; // Imported toast and Toaster component
import API from "../../utils/axios";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "At least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      const response = await API.post(
        "http://localhost:5000/api/auth/login",
        values,
      );

      console.log("Login successful:", response.data);

      toast.success("Welcome back! Login successful.", {
        duration: 3000,
        style: {
          background: "#223026",
          color: "#FAFAF8",
          fontSize: "13px",
          fontFamily: "sans-serif",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#A4B494",
          secondary: "#223026",
        },
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Invalid credentials.";
      setError(message);

      // 3. Trigger Error Toast Notification
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

  return (
    <motion.div
      className="w-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 4. Toaster Container (displays the active toasts) */}
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div className="mb-6" variants={itemVariants}>
        <p className="uppercase tracking-[0.35em] text-[9px] text-[#A4B494] font-semibold">
          Welcome Back
        </p>

        <h1 className="font-serif text-3xl text-[#223026] font-light mt-2 leading-tight">
          Sign In
        </h1>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg border border-[#EF5350] bg-[#FFEBEE]/20 text-[#EF5350] text-xs font-light text-center"
        >
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="w-full">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, getFieldProps, isSubmitting }) => (
            <Form className="space-y-4">
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

              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Password
                </label>

                <motion.div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition-all duration-300 shadow-sm ${
                    touched.password && errors.password
                      ? "border-[#EF5350] bg-[#FFEBEE]/20"
                      : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F] focus-within:bg-white/60"
                  }`}
                  whileFocus={{ scale: 1.01 }}
                >
                  <div
                    className={`flex-shrink-0 ${
                      touched.password && errors.password
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }`}
                  >
                    <TbLock size={16} />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    {...getFieldProps("password")}
                    className="flex-1 bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm leading-tight"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex-shrink-0 text-[#C8D3C3] hover:text-[#A4B494] transition"
                  >
                    {showPassword ? (
                      <TbEyeOff size={16} />
                    ) : (
                      <TbEye size={16} />
                    )}
                  </button>
                </motion.div>

                {touched.password && errors.password && (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div className="flex justify-end" variants={itemVariants}>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-red-500 hover:underline tracking-wide transition font-semibold"
                >
                  Forgot password?
                </Link>
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
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}

                {isSubmitting ? "Signing in..." : "Sign In"}
              </motion.button>

              <motion.div
                variants={itemVariants}
                className="relative flex items-center justify-center py-1.5 mt-2.5"
              >
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#E8E3DB] to-transparent"></div>
                <span className="relative bg-white px-2 text-[9px] text-[#A4B494] uppercase tracking-widest font-semibold">
                  or
                </span>
              </motion.div>

              <motion.button
                type="button"
                className="w-full h-10 rounded-lg bg-white border border-[#E8E3DB] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-sm hover:shadow-md hover:bg-[#FAFAF8] transition-all duration-300 flex justify-center items-center gap-1.5"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                variants={itemVariants}
              >
                <FcGoogle size={18} />
                Google
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>

      <motion.p
        className="text-center text-xs text-[#7A8B7E] mt-4 font-light"
        variants={itemVariants}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-green-800 hover:underline transition duration-300"
        >
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default Login;
