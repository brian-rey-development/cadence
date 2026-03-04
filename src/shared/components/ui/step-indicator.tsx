type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        return (
          <div
            key={step}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: isActive ? "24px" : "6px",
              backgroundColor: isActive
                ? "var(--color-text-primary)"
                : "var(--color-border-subtle)",
            }}
          />
        );
      })}
    </div>
  );
}
