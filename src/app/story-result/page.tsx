'use client';
import { useState, useEffect } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';
import { SpeechToText } from '@/components/SpeechToText';
import { Button } from '@/components/ui/button';

const StoryResultPage = () => {
    const { storyContent } = useStoryStore();
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

    useEffect(() => {
        if (storyContent) {
            const split = storyContent
                .split(/\n\n+/) // split by double newlines or more
                .map(p => p.trim())
                .filter(p => p.length > 0);
            setParagraphs(split);
        }
    }, [storyContent]);

    const handleNextParagraph = () => {
        if (currentParagraphIndex < paragraphs.length - 1) {
            setCurrentParagraphIndex(prev => prev + 1);
        }
    };

    const hasNextParagraph = currentParagraphIndex < paragraphs.length - 1;

    //     return (
    //         <div className="container mx-auto py-10 px-4 max-w-6xl">
    //             <h1 className="text-2xl font-bold mb-4">Your Story Result</h1>
    //             <div className="flex flex-col lg:flex-row gap-4">
    //                 {storyContent && (
    //                     <div
    //                         className="mt-6 flex-1 p-4 border border-gray-300 rounded w-full max-w-2xl
    // bg-white"
    //                     >
    //                         <h2 className="text-xl font-bold mb-2">
    //                             Generated Story:
    //                         </h2>
    //                         {/**Separate paragraphs */}
    //                         {storyContent.split(/\n\n|\n/).map((para, idx) => (
    //                             <p key={idx} className="mb-4 leading-relaxed">
    //                                 {para.trim()}
    //                             </p>
    //                         ))}
    //                     </div>
    //                 )}
    //                 <div className="mt-6 flex-1">
    //                     <SpeechToText />
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };
    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex flex-col gap-4 items-center jestifyContent-center">
                <h1 className="text-2xl font-bold mb-4">Your Story Result</h1>
                {storyContent && (
                    <div className="mt-6 flex-1 p-4 border border-gray-300 rounded w-full max-w-2xl bg-white relative">
                        <h2 className="text-xl font-bold mb-2">
                            Generated Story:
                        </h2>
                        <div className="text-lg leading-loose mb-6">
                            {paragraphs[currentParagraphIndex]}
                        </div>

                        <div className="mt-6 flex justify-between w-full gap-4">
                            {!hasNextParagraph && paragraphs.length > 0 && (
                                <>
                                    <Button
                                        className="hover:bg-gray-300  hover:text-black"
                                        onClick={() =>
                                            setCurrentParagraphIndex(0)
                                        }
                                    >
                                        Back to First Paragraph
                                    </Button>
                                    <p className="text-gray-500 italic mb-2">
                                        End of Story
                                    </p>
                                </>
                            )}
                            {hasNextParagraph && (
                                <div className="flex justify-end w-full">
                                    <Button
                                        className="hover:bg-gray-300  hover:text-black"
                                        onClick={handleNextParagraph}
                                    >
                                        Next Paragraph
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* <div className="mt-6 flex-1">
                    <SpeechToText />
                </div> */}
            </div>
        </div>
    );
};

export default StoryResultPage;
