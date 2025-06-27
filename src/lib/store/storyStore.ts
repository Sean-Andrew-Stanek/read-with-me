import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

type StoryState = {
    storyContent: string;
    setStoryContent: (story: string) => void;
};

export const useStoryStore: UseBoundStore<StoreApi<StoryState>> =
    create<StoryState>()(
        persist(
            (set): StoryState => ({
                storyContent: '',
                setStoryContent: (story: string) => set({ storyContent: story })
            }),
            { name: 'story-storage' } // Zustand state is lost unless persisted
        )
    );
