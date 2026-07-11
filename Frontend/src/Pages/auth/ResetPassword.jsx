import { useState } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { TbLock, TbEye, TbEyeOff } from "react-icons/tb";
import * as Yup from "yup";
import FormField from "../../components/common/FormField";

const resetSchema = Yup.object({
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
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
        {({ isSubmitting }) => (
          <Form>
            <FormField
              name="password"
              type={showPassword ? "text" : "password"}
              label="New Password"
              icon={TbLock}
              placeholder="••••••••"
              rightIcon={showPassword ? <TbEyeOff size={17} /> : <TbEye size={17} />}
              onRightIconClick={() => setShowPassword((p) => !p)}
            />
            <FormField
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              label="Confirm New Password"
              icon={TbLock}
              placeholder="••••••••"
              rightIcon={showConfirm ? <TbEyeOff size={17} /> : <TbEye size={17} />}
              onRightIconClick={() => setShowConfirm((p) => !p)}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60 mt-2"
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
        Back to Sign In
      </Link>
    </>
  );
};

export default ResetPassword;