import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "xs" | "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50",
  secondary:
    "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50",
  danger: "bg-red-500 hover:bg-red-600 text-white disabled:opacity-50",
  ghost:
    "bg-transparent text-brand-700 dark:text-teal-300 hover:text-brand-600 dark:hover:text-teal-200 disabled:opacity-40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "px-3 py-1 text-xs rounded",
  sm: "px-3 py-1.5 text-sm rounded",
  md: "h-10 px-5 text-sm rounded-md",
};

// shared button primitive so accent colors (brand teal) and interaction
// states live in one place instead of being hand-copied per call site -
// that drift is what caused leftover blue buttons alongside teal ones
function Button({
  variant = "primary",
  size = "sm",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={size === "md" ? 14 : 12} />}
      {children}
    </button>
  );
}

export default Button;
