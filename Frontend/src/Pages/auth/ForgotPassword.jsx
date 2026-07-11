import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { TbMail, TbArrowLeft } from "react-icons/tb";
import * as Yup from "yup";

const forgotSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    // TODO: dispatch sendOTP thunk
    console.log(values);
    setSubmitting(false);
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-sage uppercase font-medium mb-1">
          Account recovery
        </p>
        <h2 className="font-serif text-[32px] font-light text-forest leading-tight">
          Forgot Password
        </h2>
        <div className="w-8 h-px bg-clay mt-3 mb-5" />
        <p className="text-sm text-text-muted font-light leading-relaxed">
          Enter your registered email and we'll send a one-time code to reset
          your password.
        </p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, getFieldProps, isSubmitting }) => (
          <Form>
            <div className="mb-6">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Reset Code"}
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

export default ForgotPassword;
