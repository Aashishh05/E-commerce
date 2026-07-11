import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { TbMail, TbArrowLeft } from "react-icons/tb";
import * as Yup from "yup";
import FormField from "../../components/common/FormField";

const forgotSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
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
          Enter your registered email and we'll send a one-time code to reset your password.
        </p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormField
              name="email"
              type="email"
              label="Email Address"
              icon={TbMail}
              placeholder="your@email.com"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60 mt-2"
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