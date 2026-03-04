type ButtonVariant = "primary" | "ghost" | "icon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "h-12 px-6 rounded-full bg-[#F0EDE8] text-[#0E0E0F] text-[15px] font-medium font-['DM_Sans'] transition-colors duration-150 hover:bg-[#E0DDD8] disabled:opacity-40 disabled:cursor-not-allowed dark:bg-[#F0EDE8] dark:text-[#0E0E0F]",
  ghost:
    "h-10 px-4 rounded-full text-[13px] font-['DM_Sans'] text-[#8A8A95] transition-colors duration-150 hover:bg-white/5 active:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed",
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
      className={`${variants[variant]} ${className} min-h-[44px] inline-flex items-center justify-center`}
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
