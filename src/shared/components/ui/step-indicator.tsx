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
        const stepNum = i + 1;
        return (
          <div
            key={stepNum}
            className="h-1.5 w-1.5 rounded-full transition-colors"
            style={{
              backgroundColor:
                stepNum === currentStep
                  ? "var(--color-text-primary)"
                  : "var(--color-text-tertiary)",
            }}
          />
        );
      })}
    </div>
  );
}
