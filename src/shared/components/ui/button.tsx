type ButtonVariant = "primary" | "ghost" | "icon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "h-12 px-6 rounded-full bg-[var(--color-primary-bg)] text-primary-text text-base font-medium font-body transition-colors duration-150 hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "h-10 px-4 rounded-full text-base font-body text-text-secondary transition-colors duration-150 hover:bg-white/5 active:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed",
  icon: "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-white/5 active:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed",
};

export default function Button({
  variant = "primary",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${className} min-h-11 inline-flex items-center justify-center`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
