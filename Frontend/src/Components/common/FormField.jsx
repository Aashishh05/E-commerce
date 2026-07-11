import { useField } from "formik";

const FormField = ({ label, icon: Icon, rightIcon, onRightIconClick, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="mb-5">
      <label className="block text-[11px] tracking-[0.15em] uppercase text-forest-mid font-medium mb-2">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-[#FAFAF7] border rounded-sm transition-colors duration-200 ${
          hasError
            ? "border-red-400"
            : "border-[#E2DDD6] focus-within:border-sage"
        }`}
      >
        {Icon && <Icon className="text-text-muted shrink-0" size={17} />}
        <input
          {...field}
          {...props}
          className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-text-muted font-sans"
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="text-text-muted hover:text-forest transition-colors"
          >
            {rightIcon}
          </button>
        )}
      </div>
      {hasError && (
        <p className="mt-1.5 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default FormField;