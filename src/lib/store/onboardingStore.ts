import { create, type StoreApi, type UseBoundStore } from 'zustand';

interface OnboardingState {
    showOnboarding: boolean;
    setShowOnboarding: (value: boolean) => void;
}

export const useOnboardingStore: UseBoundStore<StoreApi<OnboardingState>> =
    create<OnboardingState>(
        (set): OnboardingState => ({
            showOnboarding: false,
            setShowOnboarding: value => set({ showOnboarding: value })
        })
    );
