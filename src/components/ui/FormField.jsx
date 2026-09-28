import React from "react";

export function FormField({
  label,
  error,
  required = false,
  helperText,
  children,
  className = "",
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

export function FormInput({
  label,
  error,
  required,
  helperText,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <FormField label={label} error={error} required={required} helperText={helperText} className={className}>
      <input
        className={`w-full px-3.5 py-2.5 rounded-xl border ${
          error ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:border-black focus:ring-black"
        } bg-white text-gray-900 text-sm focus:outline-none focus:ring-1 transition-all ${inputClassName}`}
        {...props}
      />
    </FormField>
  );
}

export function FormSelect({
  label,
  error,
  required,
  helperText,
  options = [],
  className = "",
  selectClassName = "",
  ...props
}) {
  return (
    <FormField label={label} error={error} required={required} helperText={helperText} className={className}>
      <select
        className={`w-full px-3.5 py-2.5 rounded-xl border ${
          error ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:border-black focus:ring-black"
        } bg-white text-gray-900 text-sm focus:outline-none focus:ring-1 transition-all ${selectClassName}`}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === "object" ? opt.value : opt;
          const label = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </FormField>
  );
}

export default FormField;
