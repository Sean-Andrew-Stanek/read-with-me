'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStoryById } from '../../../services/apiServices';
import { Story } from '../../../lib/types/story';
import { SpeechToText } from '../../../components/SpeechToText';
import { Button } from '@/components/ui/button';
import { convertToTitleCase } from '@/lib/utils/formatters';

const ReadStory = () => {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
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
            } catch (error) {
                console.error('Error fetching story:', error);
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
                <img src="/loading.gif" alt="Loading story..." />
            </div>
        );
    if (!story) return <p>Story not found.</p>;

    const handleNextParagraph = () => {
        if (currentParagraphIndex < paragraphs.length - 1) {
            setCurrentParagraphIndex(currentParagraphIndex + 1);
        }
    };

    const handlePreviousParagraph = () => {
        if (currentParagraphIndex > 0) {
            setCurrentParagraphIndex(currentParagraphIndex - 1);
        }
    };

    const handleFirstParagraph = () => {
        setCurrentParagraphIndex(0);
    };

    const hasNextParagraph = currentParagraphIndex < paragraphs.length - 1;
    const hasPreviousParagraph = currentParagraphIndex > 0;

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <h1 className="text-5xl font bold mb-4">
                {convertToTitleCase(`${story.title}`)}
            </h1>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 p-4 mt-6 border rounded bg-white shadow relative">
                    <div className="text-4xl whitespace-pre-line leading-loose line-height-2 mb-18">
                        {paragraphs[currentParagraphIndex]}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        {hasPreviousParagraph && (
                            <Button
                                className="bg-black text-white hover:bg-gray-300 hover:text-black"
                                variant="outline"
                                onClick={handlePreviousParagraph}
                            >
                                Previous Paragraph
                            </Button>
                        )}
                        {currentParagraphIndex > 0 && (
                            <Button
                                className="bg-black text-white hover:bg-gray-300 hover:text-black"
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
                                className="mt-6 hover:bg-gray-300 hover:text-black"
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
