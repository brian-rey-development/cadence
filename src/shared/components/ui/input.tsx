type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export default function Input({ error, className = "", ...props }: InputProps) {
  const borderClass = error
    ? "border-[#9E5A5A] focus:border-[#9E5A5A]"
    : "border-[#2A2A30] focus:border-[#3A3A42]";

  return (
    <div className="flex flex-col gap-1">
      <input
        className={`
          h-12 w-full px-4 rounded-[10px] text-[15px] font-['DM_Sans']
          bg-[#17171A] text-[#F0EDE8] placeholder:text-[#55555F]
          border ${borderClass}
          outline-none transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-['DM_Sans'] text-[#B57575] px-1">
          {error}
        </p>
      )}
    </div>
  );
}
