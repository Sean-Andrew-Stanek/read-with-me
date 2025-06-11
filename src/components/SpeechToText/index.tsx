'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import stringSimilarity from 'string-similarity';
import { Story } from '@/lib/types/story';

type Props = {
    expectedText: string;
    story: Story;
    paragraphIndex: number;
    showSavedScore?: boolean;
    onAccurateRead: (index: number) => void;
};

const SpeechToText: React.FC<Props> = ({
    expectedText,
    onAccurateRead,
    story,
    paragraphIndex,
    showSavedScore
}: Props) => {
    const [isListening, setIsListening] = useState(false);
    const [, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const transcriptRef = useRef('');
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const shouldStopRef = useRef(false);
    const latestExpectedRef = useRef(expectedText);

    useEffect(() => {
        latestExpectedRef.current = expectedText;
    }, [expectedText]);

    const evaluateTranscript = (): void => {
        const currentExpected = latestExpectedRef.current;
        const currentTranscript = transcriptRef.current;

        if (!currentTranscript || !currentExpected) return;

        const similarity = stringSimilarity.compareTwoStrings(
            currentTranscript.toLowerCase(),
            currentExpected.toLowerCase()
        );

        const newScore = Math.round(similarity * 100);

        setScore(newScore);

        const existingScore =
            story?.scoresByParagraph?.[String(paragraphIndex)];
        if (existingScore === newScore) {
            console.log('Score is the same, skipping update');
        } else if (story) {
            handleSubmitScore(story, paragraphIndex, newScore);
        }

        if (similarity > 0.9) {
            setMessage(
                'Great! You read it accurately. You will be redirected to next paragraph.'
            );
            setTimeout(() => {
                onAccurateRead(paragraphIndex);
            }, 3000);
        } else {
            setMessage('Not quite there. Try again or click Start to retry.');
        }
    };

    useEffect(() => {
        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            setError(
                "Your browser doesn't support speech recognition. Try Chrome or Edge."
            );
            return;
        }

        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = (): void => {
            setIsLoading(false);
            setIsListening(true);
        };

        recognitionRef.current.onend = (): void => {
            setIsListening(false);

            // Wait briefly to ensure transcriptRef has updated
            setTimeout(() => {
                evaluateTranscript();

                if (!shouldStopRef.current) {
                    try {
                        recognitionRef.current?.start();
                    } catch (error) {
                        // eslint-disable-next-line no-console
                        console.error('Failed to restart:', error);
                    }
                }
            }, 200);
        };

        type SpeechRecognitionErrorEvent = Event & {
            error: string;
        };

        recognitionRef.current.onerror = (event: Event): void => {
            const errorEvent = event as SpeechRecognitionErrorEvent;
            setError(`Speech recognition error: ${errorEvent.error}`);
            setIsListening(false);
            setIsLoading(false);
        };

        recognitionRef.current.onresult = (
            event: SpeechRecognitionEvent
        ): void => {
            let finalTranscript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                    isFinal = true;
                }
            }

            if (finalTranscript) {
                // const full = (transcript + ' ' + finalTranscript).trim();
                const full = finalTranscript.trim();

                setTranscript(full);
                transcriptRef.current = full;

                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                }

                //  Only restart silence timer when user finishes a phrase
                if (isFinal) {
                    silenceTimerRef.current = setTimeout(() => {
                        if (!shouldStopRef.current) {
                            shouldStopRef.current = true;
                            recognitionRef.current?.stop(); // triggers `onend` which handles scoring
                        }
                    }, 1500);
                }
            }
        };

        return (): void => {
            recognitionRef.current?.stop();
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTranscript('');
        transcriptRef.current = '';
        setScore(null);
        setMessage('');
        shouldStopRef.current = true;
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        recognitionRef.current?.stop();
    }, [expectedText]);

    const startListening = (): void => {
        setError(null);
        setIsLoading(true);
        shouldStopRef.current = false;

        // FULL reset
        setTranscript('');
        transcriptRef.current = '';
        setScore(null);
        setMessage('');

        try {
            recognitionRef.current?.start();
        } catch {
            recognitionRef.current?.stop();
            setTimeout(() => recognitionRef.current?.start(), 100);
        }
    };

    const stopListening = (): void => {
        shouldStopRef.current = true;
        recognitionRef.current?.stop();

        if (transcriptRef.current) {
            evaluateTranscript();
        }
    };

    useEffect(() => {
        setTranscript('');
        transcriptRef.current = '';
        setScore(null);
        setMessage('');
    }, [expectedText]);

    const handleSubmitScore = async (
        story: Story,
        paragraphIndex: number,
        newScore: number
    ) => {
        const res = await fetch(`/api/story/${story.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ paragraphIndex, newScore }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            console.log(`Score updated for paragraph ${paragraphIndex}!`);
            console.log(
                'Submitting score for paragraph',
                paragraphIndex,
                'with score',
                newScore
            );
        } else {
            console.error('Failed to update score');
        }
    };

    useEffect(() => {
        if (
            showSavedScore &&
            story?.scoresByParagraph?.[String(paragraphIndex)] !== undefined
        ) {
            setScore(story.scoresByParagraph[String(paragraphIndex)]);
            setMessage(`This is your last saved score for this paragraph.`);
        }
    }, [story, paragraphIndex, showSavedScore]);

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                    Speech to Text
                    {isListening && (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 animate-pulse"
                        >
                            Listening...
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>

            {score !== null && (
                <div className="mt-4 ml-6">
                    <p className="text-lg font-semibold">
                        Your Accuracy Score: {score}%
                    </p>
                    <p className="text-green-600">{message}</p>
                </div>
            )}
            <CardFooter className="flex justify-end">
                <div className="space-x-2">
                    {isListening ? (
                        <Button
                            variant="destructive"
                            onClick={stopListening}
                            className="gap-2"
                        >
                            <MicOff className="h-4 w-4" />
                            Stop
                        </Button>
                    ) : (
                        <Button
                            onClick={startListening}
                            className="gap-2 cursor-pointer"
                            disabled={isLoading || !!error}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Mic className="h-4 w-4" />
                            )}
                            Start Recording
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

export default SpeechToText;
