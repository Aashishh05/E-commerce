import { useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLock, TbEye, TbEyeOff, TbCheck, TbArrowLeft } from "react-icons/tb";
import * as Yup from "yup";

const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords don't match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your account";

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Reset password:", values);

    setTimeout(() => {
      setSubmitting(false);
      setResetSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
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

  if (resetSuccess) {
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
            Password Reset
          </h1>

          <p className="text-xs text-[#7A8B7E] font-light leading-relaxed">
            Your password has been updated. Sign in with your new password.
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
          Security Update
        </p>

        <h1 className="font-serif text-3xl text-[#223026] font-light mt-2 leading-tight">
          New Password
        </h1>

        <p className="text-xs text-[#7A8B7E] mt-2 leading-relaxed font-light">
          Create a strong password for your account.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, getFieldProps, isSubmitting, values }) => (
            <Form className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  New Password
                </label>

                <motion.div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition-all duration-300 shadow-sm ${
                    touched.newPassword && errors.newPassword
                      ? "border-[#EF5350] bg-[#FFEBEE]/20"
                      : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F] focus-within:bg-white/60"
                  }`}
                  whileFocus={{ scale: 1.01 }}
                >
                  <div
                    className={`flex-shrink-0 ${
                      touched.newPassword && errors.newPassword
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }`}
                  >
                    <TbLock size={16} />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    {...getFieldProps("newPassword")}
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

                {touched.newPassword && errors.newPassword && (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.newPassword}
                  </motion.p>
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

                {values.newPassword &&
                  values.confirmPassword &&
                  values.newPassword === values.confirmPassword && (
                    <motion.p
                      className="text-[9px] text-[#7CB342] mt-1 flex items-center gap-1 font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <TbCheck size={12} /> Passwords match
                    </motion.p>
                  )}

                {touched.confirmPassword && errors.confirmPassword && (
                  <motion.p
                    className="text-[#EF5350] text-[9px] mt-1 font-light"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="bg-[#A4B494]/5 border border-[#A4B494]/20 rounded-lg p-3"
                variants={itemVariants}
              >
                <p className="text-[9px] text-[#7A8B7E] leading-relaxed font-semibold">
                  Use at least 8 characters with uppercase, lowercase, and
                  numbers.
                </p>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-[#D8B98F] via-[#E9D3AE] to-[#D8B98F] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
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

                {isSubmitting ? "Updating..." : "Reset Password"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>

      <motion.p
        className="text-center text-xs text-[#7A8B7E] mt-4 font-light"
        variants={itemVariants}
      >
        Back to 
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

export default ResetPassword;
