import { createContext, useContext } from "react";

type OnboardingValue = {
  completedOnboarding: boolean;
  setCompletedOnboarding: (completed: boolean) => Promise<void>;
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

export const OnboardingProvider = OnboardingContext.Provider;

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
