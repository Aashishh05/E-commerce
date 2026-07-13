import { useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbUser,
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbCheck,
  TbBuildingStore,
  TbFileText,
  TbMapPin,
  TbPhone,
  TbChevronDown,
  TbUserCircle,
} from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import toast from "react-hot-toast";
import API from "../../utils/axios";

// Concise Validation Schema
const registerSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Confirm password"),
  role: Yup.string().oneOf(["buyer", "seller"]).required(),
  shopName: Yup.string().when("role", {
    is: "seller",
    then: (s) => s.required("Shop name is required"),
    otherwise: (s) => s.notRequired(),
  }),
  description: Yup.string().when("role", {
    is: "seller",
    then: (s) => s.required("Description is required"),
    otherwise: (s) => s.notRequired(),
  }),
  address: Yup.string().when("role", {
    is: "seller",
    then: (s) => s.required("Address is required"),
    otherwise: (s) => s.notRequired(),
  }),
  contactNumber: Yup.string().when("role", {
    is: "seller",
    then: (s) => s.required("Contact number is required"),
    otherwise: (s) => s.notRequired(),
  }),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.role === "seller" && {
          shopName: values.shopName,
          description: values.description,
          address: values.address,
          contactNumber: values.contactNumber,
        }),
      };
      const res = await API.post("/api/auth/register", payload);
      toast.success(res.data.message || "Registration successful! 🎉");
      setTimeout(
        () => navigate("/verify-otp", { state: { email: values.email } }),
        1000,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto flex flex-col px-4 md:px-0 max-h-[85vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#A4B494]/60"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
    >
      <motion.div
        className="mb-5 text-center md:text-left"
        variants={itemVariants}
      >
        <p className="uppercase tracking-[0.35em] text-[9px] text-[#A4B494] font-semibold">
          Join Premium
        </p>
        <h1 className="font-serif text-3xl text-[#223026] font-light mt-1.5">
          Create Account
        </h1>
        <p className="text-xs text-[#7A8B7E] mt-1 font-light">
          Join thousands discovering premium products.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "buyer",
            shopName: "",
            description: "",
            address: "",
            contactNumber: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, getFieldProps, isSubmitting, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role Selector dropdown */}
              {/* Role Selector */}
              <motion.div
                variants={itemVariants}
                className="col-span-full w-full"
              >
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6B7A63]">
                  <TbUserCircle size={17} />
                  Account Type
                </label>

                <div className="relative w-full">
                  {/* Left Icon */}
                  <TbUserCircle
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A82] pointer-events-none"
                  />

                  <select
                    {...getFieldProps("role")}
                    className="
        w-full
        h-12
        rounded-xl
        border border-[#E7E3DB]
        bg-white
        pl-12
        pr-12
        text-[15px]
        font-medium
        text-[#223026]
        outline-none
        appearance-none
        transition-all
        duration-300
        ease-in-out
        hover:border-[#CBB08A]
        focus:border-[#CBB08A]
        focus:ring-4
        focus:ring-[#E9D8B8]/40
        shadow-sm
      "
                  >
                    <option value="buyer">🛍 Buyer</option>
                    <option value="seller">🏪 Seller</option>
                  </select>

                  <TbChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9A82] pointer-events-none transition-transform duration-300"
                  />
                </div>

                <p className="mt-2 text-sm text-[#8A9385]">
                  Select whether you want to shop or sell products.
                </p>
              </motion.div>

              <div className="col-span-1">
                <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Full Name
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 ${touched.name && errors.name ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                >
                  <TbUser
                    size={16}
                    className={
                      touched.name && errors.name
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }
                  />
                  <input
                    type="text"
                    {...getFieldProps("name")}
                    className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm"
                    placeholder="John Doe"
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-[#EF5350] text-[9px] mt-0.5">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Email
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 ${touched.email && errors.email ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                >
                  <TbMail
                    size={16}
                    className={
                      touched.email && errors.email
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }
                  />
                  <input
                    type="email"
                    {...getFieldProps("email")}
                    className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[#EF5350] text-[9px] mt-0.5">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Password
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 relative ${touched.password && errors.password ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                >
                  <TbLock
                    size={16}
                    className={
                      touched.password && errors.password
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...getFieldProps("password")}
                    className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm pr-8"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#C8D3C3] hover:text-[#A4B494] transition"
                  >
                    {showPassword ? (
                      <TbEyeOff size={16} />
                    ) : (
                      <TbEye size={16} />
                    )}
                  </button>
                </div>
                {touched.password && errors.password ? (
                  <p className="text-[#EF5350] text-[9px] mt-0.5">
                    {errors.password}
                  </p>
                ) : (
                  <p className="text-[9px] text-[#7A8B7E] mt-0.5 font-semibold">
                    At least 6 characters with letters & numbers.
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 relative ${touched.confirmPassword && errors.confirmPassword ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                >
                  <TbLock
                    size={16}
                    className={
                      touched.confirmPassword && errors.confirmPassword
                        ? "text-[#EF5350]"
                        : "text-[#A4B494]"
                    }
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    {...getFieldProps("confirmPassword")}
                    className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm pr-8"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 text-[#C8D3C3] hover:text-[#A4B494] transition"
                  >
                    {showConfirm ? <TbEyeOff size={16} /> : <TbEye size={16} />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-[#EF5350] text-[9px] mt-0.5">
                    {errors.confirmPassword}
                  </p>
                )}
                {values.password &&
                  values.confirmPassword &&
                  values.password === values.confirmPassword && (
                    <p className="text-[9px] text-[#7CB342] mt-0.5 flex items-center gap-1">
                      <TbCheck size={12} /> Passwords match
                    </p>
                  )}
              </div>

              <AnimatePresence mode="wait">
                {values.role === "seller" && (
                  <motion.div
                    key="seller-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden pt-1"
                  >
                    <div>
                      <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                        Shop Name
                      </label>
                      <div
                        className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 ${touched.shopName && errors.shopName ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                      >
                        <TbBuildingStore
                          size={16}
                          className={
                            touched.shopName && errors.shopName
                              ? "text-[#EF5350]"
                              : "text-[#A4B494]"
                          }
                        />
                        <input
                          type="text"
                          {...getFieldProps("shopName")}
                          className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm"
                          placeholder="Your Shop Name"
                        />
                      </div>
                      {touched.shopName && errors.shopName && (
                        <p className="text-[#EF5350] text-[9px] mt-0.5">
                          {errors.shopName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                        Contact Number
                      </label>
                      <div
                        className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 ${touched.contactNumber && errors.contactNumber ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                      >
                        <TbPhone
                          size={16}
                          className={
                            touched.contactNumber && errors.contactNumber
                              ? "text-[#EF5350]"
                              : "text-[#A4B494]"
                          }
                        />
                        <input
                          type="text"
                          {...getFieldProps("contactNumber")}
                          className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      {touched.contactNumber && errors.contactNumber && (
                        <p className="text-[#EF5350] text-[9px] mt-0.5">
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>

                    <div className="col-span-full">
                      <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                        Shop Address
                      </label>
                      <div
                        className={`flex items-center gap-3 rounded-lg border bg-white/40 px-4 h-10 transition duration-300 ${touched.address && errors.address ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                      >
                        <TbMapPin
                          size={16}
                          className={
                            touched.address && errors.address
                              ? "text-[#EF5350]"
                              : "text-[#A4B494]"
                          }
                        />
                        <input
                          type="text"
                          {...getFieldProps("address")}
                          className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm"
                          placeholder="123 Premium Way, Suite A"
                        />
                      </div>
                      {touched.address && errors.address && (
                        <p className="text-[#EF5350] text-[9px] mt-0.5">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="col-span-full">
                      <label className="block mb-1 text-[10px] tracking-[0.15em] uppercase text-[#A4B494] font-bold">
                        Shop Description
                      </label>
                      <div
                        className={`flex items-start gap-3 rounded-lg border bg-white/40 px-4 py-2 transition duration-300 ${touched.description && errors.description ? "border-[#EF5350] bg-[#FFEBEE]/20" : "border-[#E8E3DB] hover:border-[#D8B98F] focus-within:border-[#D8B98F]"}`}
                      >
                        <TbFileText
                          size={16}
                          className="mt-1 flex-shrink-0 text-[#A4B494]"
                        />
                        <textarea
                          {...getFieldProps("description")}
                          rows={2}
                          className="w-full bg-transparent outline-none text-[#223026] placeholder:text-[#C8D3C3] text-sm resize-none"
                          placeholder="Describe your brand..."
                        />
                      </div>
                      {touched.description && errors.description && (
                        <p className="text-[#EF5350] text-[9px] mt-0.5">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-full h-10 rounded-lg bg-gradient-to-r from-[#D8B98F] via-[#E9D3AE] to-[#D8B98F] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-lg hover:shadow-xl active:scale-95 transition duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
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
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <div className="col-span-full relative flex items-center justify-center py-1 mt-1">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#E8E3DB] to-transparent"></div>
                <span className="relative bg-[#FAFAF9] px-2 text-[9px] text-[#A4B494] uppercase tracking-widest font-semibold">
                  or signup with
                </span>
              </div>

              <button
                type="button"
                className="col-span-full h-10 rounded-lg bg-white border border-[#E8E3DB] text-[#223026] font-semibold tracking-widest uppercase text-xs shadow-sm hover:shadow-md hover:bg-[#F9F6F0] transition duration-300 flex justify-center items-center gap-1.5"
              >
                <FcGoogle size={18} />
                Google
              </button>
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
