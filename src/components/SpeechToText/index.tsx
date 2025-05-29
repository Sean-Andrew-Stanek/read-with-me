'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { formatSentencesWithSpacing } from '@/lib/utils/formatters';
import stringSimilarity from 'string-similarity';
import { useCallback } from 'react';

type Props = {
    expectedText: string;
    onAccurateRead: () => void;
};

export function SpeechToText({ expectedText, onAccurateRead }: Props) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const transcriptRef = useRef('');
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const shouldStopRef = useRef(false);

    // const evaluateTranscript = () => {
    //     if (!transcriptRef.current || !expectedText) return;

    //     const similarity = stringSimilarity.compareTwoStrings(
    //         transcriptRef.current.toLowerCase(),
    //         expectedText.toLowerCase()
    //     );
    //     const score = Math.round(similarity * 100);
    //     setScore(score);
    //     console.log('score:', score);

    //     if (similarity > 0.9) {
    //         setMessage('Great! You read it accurately.');
    //         onAccurateRead();
    //     } else {
    //         setMessage('Not quite there. Try again or click Start to retry.');
    //     }
    // };

    const evaluateTranscript = useCallback(() => {
        if (!transcriptRef.current || !expectedText) return;

        const similarity = stringSimilarity.compareTwoStrings(
            transcriptRef.current.toLowerCase(),
            expectedText.toLowerCase()
        );
        const newScore = Math.round(similarity * 100);
        console.log('score:', newScore);

        setScore(newScore); // ✅ Should now re-render
        setMessage(`Your accuracy score is: ${newScore}%`); // force re-render

        if (similarity > 0.9) {
            setMessage('Great! You read it accurately.');
            onAccurateRead();
        } else {
            setMessage('Not quite there. Try again or click Start to retry.');
        }
    }, [expectedText, onAccurateRead]);

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

        recognitionRef.current.onstart = () => {
            setIsLoading(false);
            setIsListening(true);
        };

        // recognitionRef.current.onend = () => {
        //     setIsListening(false);

        //     setTimeout(() => {
        //         if (transcriptRef.current) {
        //             evaluateTranscript();
        //         }

        //         if (!shouldStopRef.current) {
        //             try {
        //                 recognitionRef.current?.start();
        //             } catch (error) {
        //                 console.warn('Failed to restart:', error);
        //             }
        //         }
        //     }, 300); // Let onresult finish before evaluating
        // };

        recognitionRef.current.onend = () => {
            setIsListening(false);

            // Wait briefly to ensure transcriptRef has updated
            setTimeout(() => {
                evaluateTranscript();

                if (!shouldStopRef.current) {
                    try {
                        recognitionRef.current?.start();
                    } catch (error) {
                        console.warn('Failed to restart:', error);
                    }
                }
            }, 200);
        };

        recognitionRef.current.onerror = event => {
            setError(`Speech recognition error: ${(event as any).error}`);
            setIsListening(false);
            setIsLoading(false);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
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
                console.log('Final transcript:', finalTranscript);

                const full = (transcript + ' ' + finalTranscript).trim();
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

        return () => {
            recognitionRef.current?.stop();
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setTranscript('');
        transcriptRef.current = '';
        setScore(null);
        setMessage('');
    }, [expectedText]);

    const startListening = () => {
        setError(null);
        setIsLoading(true);
        shouldStopRef.current = false;

        try {
            recognitionRef.current?.start();
        } catch (error) {
            recognitionRef.current?.stop();
            setTimeout(() => recognitionRef.current?.start(), 100);
        }
    };

    const stopListening = () => {
        shouldStopRef.current = true;
        recognitionRef.current?.stop();

        if (transcriptRef.current) {
            evaluateTranscript();
        }
    };

    const clearTranscript = () => {
        setTranscript('');
        transcriptRef.current = '';
        setScore(null);
        setMessage('');
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
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
            {/* <CardContent>
                <div className="min-h-[200px] p-4 bg-muted/30 rounded-md overflow-auto">
                    {transcript ? (
                        <div className="text-lg whitespace-pre-line">
                            {formatSentencesWithSpacing(transcript)}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            {error ||
                                'Start speaking after clicking the microphone button...'}
                        </p>
                    )}
                </div>
            </CardContent> */}
            {score !== null && (
                <div className="mt-4 ml-6">
                    <p className="text-lg font-semibold">
                        Your Accuracy Score: {score}%
                    </p>
                    <p className="text-green-600">{message}</p>
                </div>
            )}

            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={clearTranscript}
                    disabled={!transcript || isLoading}
                >
                    Clear
                </Button>
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
                            className="gap-2"
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
}
