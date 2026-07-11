import { useState } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { TbLock, TbEye, TbEyeOff, TbArrowLeft } from "react-icons/tb";
import * as Yup from "yup";

const resetSchema = Yup.object({
  password: Yup.string()
    .min(6, "At least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    // TODO: dispatch resetPassword thunk
    console.log(values);
    setSubmitting(false);
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-sage uppercase font-medium mb-1">
          Almost there
        </p>
        <h2 className="font-serif text-[32px] font-light text-forest leading-tight">
          Reset Password
        </h2>
        <div className="w-8 h-px bg-clay mt-3 mb-5" />
        <p className="text-sm text-text-muted font-light leading-relaxed">
          Choose a strong new password for your account.
        </p>
      </div>

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={resetSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, getFieldProps, isSubmitting }) => (
          <Form>
            <div className="mb-5">
              <label className="block text-[11px] tracking-[0.15em] uppercase text-forest-mid font-medium mb-2">
                New Password
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

            <div className="mb-5">
              <label className="block text-[11px] tracking-[0.15em] uppercase text-forest-mid font-medium mb-2">
                Confirm New Password
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-[#FAFAF7] border rounded-sm transition-colors duration-200 ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-400"
                    : "border-[#E2DDD6] focus-within:border-sage"
                }`}
              >
                <TbLock className="text-text-muted shrink-0" size={17} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...getFieldProps("confirmPassword")}
                  className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="text-text-muted hover:text-forest transition-colors"
                >
                  {showConfirm ? <TbEyeOff size={17} /> : <TbEye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60 mt-1"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </Form>
        )}
      </Formik>

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 mt-8 text-xs text-text-muted hover:text-forest transition-colors"
      >
        <TbArrowLeft size={14} />
        Back to Sign In
      </Link>
    </>
  );
};

export default ResetPassword;
