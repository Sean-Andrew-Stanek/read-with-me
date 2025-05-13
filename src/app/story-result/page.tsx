'use client';
import { useStoryStore } from '@/lib/store/storyStore';
import { SpeechToText } from '@/components/SpeechToText';

const StoryResultPage = () => {
    const { storyContent } = useStoryStore();
    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Your Story Result</h1>
            <div className="flex flex-col lg:flex-row gap-4">
                {storyContent && (
                    <div
                        className="mt-6 flex-1 p-4 border border-gray-300 rounded w-full max-w-2xl 
bg-white"
                    >
                        <h2 className="text-xl font-bold mb-2">
                            Generated Story:
                        </h2>
                        {/**Separate paragraphs */}
                        {storyContent.split(/\n\n|\n/).map((para, idx) => (
                            <p key={idx} className="mb-4 leading-relaxed">
                                {para.trim()}
                            </p>
                        ))}
                    </div>
                )}
                <div className="mt-6 flex-1">
                    <SpeechToText />
                </div>
            </div>
        </div>
    );
};

export default StoryResultPage;
