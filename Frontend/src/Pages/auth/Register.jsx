import { useState } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { TbUser, TbMail, TbLock, TbEye, TbEyeOff } from "react-icons/tb";
import * as Yup from "yup";
import FormField from "../../components/common/FormField";

const registerSchema = Yup.object({
  name: Yup.string().trim().min(2, "Too short").required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    // TODO: dispatch registerUser thunk
    console.log(values);
    setSubmitting(false);
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-sage uppercase font-medium mb-1">
          Join the ritual
        </p>
        <h2 className="font-serif text-[32px] font-light text-forest leading-tight">
          Create Account
        </h2>
        <div className="w-8 h-px bg-clay mt-3" />
      </div>

      <Formik
        initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormField
              name="name"
              type="text"
              label="Full Name"
              icon={TbUser}
              placeholder="Jane Doe"
            />
            <FormField
              name="email"
              type="email"
              label="Email Address"
              icon={TbMail}
              placeholder="your@email.com"
            />
            <FormField
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              icon={TbLock}
              placeholder="••••••••"
              rightIcon={showPassword ? <TbEyeOff size={17} /> : <TbEye size={17} />}
              onRightIconClick={() => setShowPassword((p) => !p)}
            />
            <FormField
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              label="Confirm Password"
              icon={TbLock}
              placeholder="••••••••"
              rightIcon={showConfirm ? <TbEyeOff size={17} /> : <TbEye size={17} />}
              onRightIconClick={() => setShowConfirm((p) => !p)}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[13px] bg-clay text-forest text-[11px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B892] transition-colors duration-200 disabled:opacity-60 mt-1"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="text-center text-xs text-text-muted mt-7">
        Already have an account?{" "}
        <Link to="/login" className="text-sage font-medium hover:text-forest transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
};

export default Register;