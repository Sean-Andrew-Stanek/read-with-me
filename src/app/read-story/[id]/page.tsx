'use client';

import { useState, useEffect, JSX } from 'react';
import { useParams } from 'next/navigation';
import { getStoryById } from '../../../services/apiServices';
import { Story } from '../../../lib/types/story';
import SpeechToText from '../../../components/SpeechToText';
import { Button } from '@/components/ui/button';
import { convertToTitleCase } from '@/lib/utils/formatters';
import { literata } from '@/app/fonts';
import Image from 'next/image';

const ReadStory = (): JSX.Element => {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

    useEffect(() => {
        const fetchStory = async (): Promise<void> => {
            if (!id) return;
            try {
                const fetchedStory: Story | null = await getStoryById(
                    id as string
                );
                setStory(fetchedStory);
                let splitParagraphs: string[] = [];
                if (fetchedStory?.content) {
                    // Split by one or more newline characters to identify paragraphs
                    splitParagraphs = fetchedStory.content
                        .split(/\n\n+/)
                        .filter((p: string) => p.trim() !== '');
                }
                setParagraphs(splitParagraphs);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching story: ${error.message}`);
                } else {
                    throw new Error('Unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    if (loading)
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                {/* <img src="/loading.gif" alt="Loading story..." /> */}
                <Image
                    src="/loading.gif"
                    alt="Loading story..."
                    width={100}
                    height={100}
                    priority
                    unoptimized
                />
            </div>
        );
    if (!story) return <p>Story not found.</p>;

    const handleNextParagraph = (): void => {
        if (currentParagraphIndex < paragraphs.length - 1) {
            setCurrentParagraphIndex(currentParagraphIndex + 1);
        }
    };

    const handlePreviousParagraph = (): void => {
        if (currentParagraphIndex > 0) {
            setCurrentParagraphIndex(currentParagraphIndex - 1);
        }
    };

    const handleFirstParagraph = (): void => {
        setCurrentParagraphIndex(0);
    };

    const hasNextParagraph = currentParagraphIndex < paragraphs.length - 1;
    const hasPreviousParagraph = currentParagraphIndex > 0;

    return (
        <div className="font-literata mx-auto py-10 px-4 w-[50%] flex flex-col gap-4 items-center jestifyContent-center">
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-1">
                {convertToTitleCase(`${story.title}`)}
            </h1>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 p-4 mt-6 border rounded-lg bg-white shadow relative  min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
                    <div
                        className={`${literata.variable} text-2xl whitespace-pre-line leading-loose line-height-2 mb-18`}
                        style={{ fontFamily: 'var(--font-literata)' }}
                    >
                        {paragraphs[currentParagraphIndex]}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        {hasPreviousParagraph && (
                            <Button
                                className="bg-black text-white hover:bg-gray-300 hover:text-black text-sm px-3 py-1 sm:text-base sm:px-4 sm:py-2"
                                variant="outline"
                                onClick={handlePreviousParagraph}
                            >
                                Previous Paragraph
                            </Button>
                        )}
                        {currentParagraphIndex > 0 && (
                            <Button
                                className="bg-black text-white hover:bg-gray-300 hover:text-black text-sm px-3 py-1 sm:text-base sm:px-4 sm:py-2"
                                variant="outline"
                                onClick={handleFirstParagraph}
                            >
                                Start Over
                            </Button>
                        )}
                    </div>
                    <div className="absolute bottom-4 right-4">
                        {!hasNextParagraph && paragraphs.length > 0 && (
                            <p
                                className="text-gray-500 italic mb-6"
                                style={{
                                    marginRight: '16px',
                                    marginBottom: '16px'
                                }}
                            >
                                End of Story
                            </p>
                        )}
                        {hasNextParagraph && (
                            <Button
                                className="mt-6 hover:bg-gray-300 hover:text-black text-sm px-3 py-1 sm:text-base sm:px-4 sm:py-2"
                                onClick={handleNextParagraph}
                            >
                                Next Paragraph
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <SpeechToText
                expectedText={paragraphs[currentParagraphIndex]}
                onAccurateRead={handleNextParagraph}
            />
        </div>
    );
};

export default ReadStory;
