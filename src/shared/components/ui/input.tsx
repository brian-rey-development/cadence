type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export default function Input({ error, className = "", ...props }: InputProps) {
  const borderClass = error
    ? "border-[var(--color-destructive)] focus:border-[var(--color-destructive)]"
    : "border-[var(--color-border-subtle)] focus:border-[var(--color-border-strong)]";

  return (
    <div className="flex flex-col gap-1">
      <input
        className={`
          h-12 w-full px-4 rounded-[10px] text-[15px] font-['DM_Sans']
          bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
          border ${borderClass}
          outline-none transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-['DM_Sans'] text-[var(--color-destructive-text)] px-1">
          {error}
        </p>
      )}
    </div>
  );
}
