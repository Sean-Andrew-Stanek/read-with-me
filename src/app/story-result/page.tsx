'use client';
import { useState, useEffect } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';
import SpeechToText from '@/components/SpeechToText';
import { Button } from '@/components/ui/button';
import { JSX } from 'react';
import { diffWords } from 'diff';

const StoryResultPage = () => {
    const { storyContent } = useStoryStore();
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
    const [recording, setRecording] = useState(false);
    const [highlightedParagraph, setHighlightedParagraph] = useState<
        JSX.Element[] | null
    >(null);

    useEffect(() => {
        if (storyContent) {
            const split = storyContent
                .split(/\n\n+/) // split by double newlines or more
                .map(p => p.trim())
                .filter(p => p.length > 0);
            setParagraphs(split);
        }
    }, [storyContent]);
    function getLCSIndices(a: string[], b: string[]) {
        const dp = Array(a.length + 1)
            .fill(null)
            .map(() => Array(b.length + 1).fill(0));

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        let i = a.length;
        let j = b.length;
        const matchedIndices: number[] = [];

        while (i > 0 && j > 0) {
            if (a[i - 1] === b[j - 1]) {
                matchedIndices.unshift(i - 1); // match at position i-1
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        return new Set(matchedIndices); // index positions of original words that matched
    }

    const highlightDifferences = (spoken: string) => {
        const originalRaw = paragraphs[currentParagraphIndex];
        const originalWords = originalRaw.trim().split(/\s+/);
        const spokenWords = spoken
            .trim()
            .split(/\s+/)
            .map(w => w.toLowerCase());

        const matches = getLCSIndices(
            originalWords.map(w => w.toLowerCase().replace(/[.,!?]/g, '')),
            spokenWords.map(w => w.toLowerCase().replace(/[.,!?]/g, ''))
        );

        const result = originalWords.map((word, idx) =>
            matches.has(idx) ? (
                <span key={idx}>{word + ' '}</span>
            ) : (
                <span
                    key={idx}
                    style={{
                        color: 'red',
                        textDecoration: 'underline',
                        fontWeight: 'bold'
                    }}
                >
                    {word + ' '}
                </span>
            )
        );

        setHighlightedParagraph(result);
    };

    const handleNextParagraph = () => {
        if (currentParagraphIndex < paragraphs.length - 1) {
            setCurrentParagraphIndex(prev => prev + 1);
            setHighlightedParagraph(null);
        }
    };

    const hasNextParagraph = currentParagraphIndex < paragraphs.length - 1;

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex flex-col gap-4 items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Your Story Result</h1>

                {storyContent && (
                    <div className="mt-6 flex-1 p-4 border border-gray-300 rounded w-full max-w-2xl bg-white relative">
                        <h2 className="text-xl font-bold mb-2">
                            Generated Story:
                        </h2>

                        {/* ✅ This is your single paragraph */}
                        <div className="text-lg leading-loose mb-6">
                            {highlightedParagraph ||
                                paragraphs[currentParagraphIndex]}
                        </div>

                        <div className="mt-6 flex justify-between w-full gap-4">
                            {!hasNextParagraph && paragraphs.length > 0 && (
                                <>
                                    <Button
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
                                    <Button onClick={handleNextParagraph}>
                                        Next Paragraph
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ Just the button here */}
                <SpeechToText
                    paragraph={paragraphs[currentParagraphIndex]}
                    recording={recording}
                    setRecording={setRecording}
                    onResult={highlightDifferences}
                />
            </div>
        </div>
    );
};

export default StoryResultPage;
