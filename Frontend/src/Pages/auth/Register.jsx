import { useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TbUser,
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbCheck,
} from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";

const registerSchema = Yup.object({
  name: Yup.string().trim().min(2, "Too short").required("Name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "At least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Register:", values);

    setTimeout(() => {
      setSubmitting(false);
      // Navigate to email verification
      navigate("/verify-email", { state: { email: values.email } });
    }, 1500);
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
      <motion.div className="mb-6" variants={itemVariants}>
        <p className="uppercase tracking-[0.35em] text-[9px] text-[#A4B494] font-semibold">
          Join Premium
        </p>

        <h1 className="font-serif text-3xl text-[#223026] font-light mt-2 leading-tight">
          Create Account
        </h1>

        <p className="text-xs text-[#7A8B7E] mt-2 leading-relaxed font-light">
          Join thousands, discovering premium products.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, getFieldProps, isSubmitting, values }) => (
            <Form className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Full Name
                </label>

                <motion.div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition-all duration-300 shadow-sm ${
                    touched.name && errors.name
                      ? "border-[#EF5350] bg-[#FFEBEE]/20"
                      : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F] focus-within:bg-white/60"
                  }`}
                  whileFocus={{ scale: 1.01 }}
                >
                  <div
                    className={`flex-shrink-0 ${
                      touched.name && errors.name
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }`}
                  >
                    <TbUser size={16} />
                  </div>

                  <input
                    type="text"
                    {...getFieldProps("name")}
                    className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm leading-tight"
                    placeholder="John Doe"
                  />
                </motion.div>

                {touched.name && errors.name && (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

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

                {touched.password && errors.password ? (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                ) : (
                  <p className="text-[10px] text-green-800 mt-1 font-semibold">
                    At least 6 characters with letters and numbers.
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Confirm Password
                </label>

                <motion.div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition-all duration-300 shadow-sm ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-[#EF5350] bg-[#FFEBEE]/20"
                      : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F] focus-within:bg-white/60"
                  }`}
                  whileFocus={{ scale: 1.01 }}
                >
                  <div
                    className={`flex-shrink-0 ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }`}
                  >
                    <TbLock size={16} />
                  </div>

                  <input
                    type={showConfirm ? "text" : "password"}
                    {...getFieldProps("confirmPassword")}
                    className="flex-1 bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm leading-tight"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="flex-shrink-0 text-[#C8D3C3] hover:text-[#A4B494] transition"
                  >
                    {showConfirm ? <TbEyeOff size={16} /> : <TbEye size={16} />}
                  </button>
                </motion.div>

                {touched.confirmPassword && errors.confirmPassword && (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}

                {values.password &&
                  values.confirmPassword &&
                  values.password === values.confirmPassword && (
                    <motion.p
                      className="text-[9px] text-[#7CB342] mt-1 flex items-center gap-1 font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <TbCheck size={12} /> Passwords match
                    </motion.p>
                  )}
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
                    transition={{ duration: 1, repeat: Infinity, linear: true }}
                  />
                )}
                {isSubmitting ? "Creating..." : "Create Account"}
              </motion.button>

              <motion.div
                variants={itemVariants}
                className="relative flex items-center justify-center py-1.5 mt-2.5"
              >
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#E8E3DB] to-transparent"></div>
                <span className="relative bg-white px-2 text-[9px] text-[#A4B494] uppercase tracking-widest font-semibold">
                  or signup with
                </span>
              </motion.div>

              <motion.button
                type="button"
                className="w-full h-10 rounded-lg bg-white border border-[#E8E3DB] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-sm hover:shadow-md hover:bg-[#f3f2d2] transition-all duration-300 flex justify-center items-center gap-1.5"
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
        Already have an account?
        <Link
          to="/login"
          className="font-semibold text-green-800 hover:underline transition duration-300"
        >
          Sign In
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default Register;
