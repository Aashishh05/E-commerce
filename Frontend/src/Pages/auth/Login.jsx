import { useState } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { TbMail, TbLock, TbEye, TbEyeOff } from "react-icons/tb";
import * as Yup from "yup";

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

  const handleSubmit = (values, { setSubmitting }) => {
    // TODO: dispatch loginUser thunk
    console.log(values);
    setSubmitting(false);
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-sage uppercase font-medium mb-1">
          Welcome back
        </p>
        <h2 className="font-serif text-[32px] font-light text-forest leading-tight">
          Sign In
        </h2>
        <div className="w-8 h-px bg-clay mt-3" />
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, getFieldProps, isSubmitting }) => (
          <Form>
            <div className="mb-5">
              <label className="block text-[11px] tracking-[0.15em] uppercase text-forest-mid font-medium mb-2">
                Email Address
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-[#FAFAF7] border rounded-sm transition-colors duration-200 ${
                  errors.email && touched.email
                    ? "border-red-400"
                    : "border-[#E2DDD6] focus-within:border-sage"
                }`}
              >
                <TbMail className="text-text-muted shrink-0" size={17} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...getFieldProps("email")}
                  className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-text-muted"
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-[11px] tracking-[0.15em] uppercase text-forest-mid font-medium mb-2">
                Password
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-[#FAFAF7] border rounded-sm transition-colors duration-200 ${
                  errors.password && touched.password
                    ? "border-red-400"
                    : "border-[#E2DDD6] focus-within:border-sage"
                }`}
              >
                <TbLock className="text-text-muted shrink-0" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...getFieldProps("password")}
                  className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-text-muted hover:text-forest transition-colors"
                >
                  {showPassword ? <TbEyeOff size={17} /> : <TbEye size={17} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password"
                className="text-[11px] text-sage hover:text-forest tracking-wide transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-[#E2DDD6]" />
        <span className="text-[11px] text-text-muted tracking-widest">or</span>
        <div className="flex-1 h-px bg-[#E2DDD6]" />
      </div>

      <p className="text-center text-xs text-text-muted">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-sage font-medium hover:text-forest transition-colors"
        >
          Create one
        </Link>
      </p>
    </>
  );
};

export default Login;
