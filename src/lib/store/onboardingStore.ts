import { create } from 'zustand';

interface OnboardingState {
    showOnboarding: boolean;
    setShowOnboarding: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>(set => ({
    showOnboarding: false,
    setShowOnboarding: value => set({ showOnboarding: value })
}));
