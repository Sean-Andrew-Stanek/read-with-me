'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from  '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
export function SpeechToText() {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    useEffect(() => {
        if (
            !('webkitSpeechRecognition' in window) &&
            !('SpeechRecognition' in window)
        ) {
            setError(
                "Your browser doesn't support speech recognition. Try Chrome or Edge."
            );
            return;
        }
        // Initialize speech recognition
        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setError('Speech Recognition API not supported in this browser.');
            return;
        }
        recognitionRef.current = new SpeechRecognitionAPI();
        if (recognitionRef.current) {
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsLoading(false);
                setIsListening(true);
            };
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
            recognitionRef.current.onerror = event => {
                setError(`Speech recognition error: ${(event as any).error}`);
                setIsListening(false);
                setIsLoading(false);
            };
            recognitionRef.current.onresult = (
                event: SpeechRecognitionEvent
            ) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    }
                }

                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }
            };
        }
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);
    const startListening = () => {
        setError(null);
        setIsLoading(true);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                // Handle the case where recognition is already started
                recognitionRef.current.stop();

                setTimeout(() => {
                    recognitionRef.current?.start();
                }, 100);
            }
        }
    };
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
    const clearTranscript = () => {
        setTranscript('');
    };
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Speech to Text
                    {isListening && (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 animate-pulse">
                            Listening...
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="min-h-[200px] p-4 bg-muted/30 rounded-md overflow-auto">
                    {transcript ? (
                        <p className="text-sm">{transcript}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            {error ||
                                'Start speaking after clicking the microphone button...'}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    className={`${!isLoading && !error ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                            className={`gap-2 ${!isLoading && !error ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                            <MicOff className="h-4 w-4" />
                            Stop
                        </Button>
                    ) : (
                        <Button
                            onClick={startListening}
                            className={`gap-2 ${!isLoading && !error ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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