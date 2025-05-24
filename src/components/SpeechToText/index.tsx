'use client';
import React, { useRef } from 'react';

type Props = {
    paragraph: string;
    setRecording: (value: boolean) => void;
    onResult: (spokenText: string) => void;
    recording: boolean;
};

const SpeechToText = ({
    paragraph,
    setRecording,
    onResult,
    recording
}: Props) => {
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const SpeechRecognition =
        typeof window !== 'undefined' &&
        ((window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition);

    const startRecognition = () => {
        if (!SpeechRecognition) {
            alert('Speech Recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript + ' ';
            }

            setTimeout(() => {
                onResult(transcript.trim());
            }, 500); // slight buffer to let it complete
        };

        recognition.onerror = () => setRecording(false);
        recognition.onend = () => setRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
        setRecording(true);
    };

    const stopRecognition = () => {
        recognitionRef.current?.stop();
        setRecording(false);
    };

    const handleToggle = () => {
        if (recording) {
            stopRecognition();
        } else {
            startRecognition();
        }
    };

    return (
        <button
            onClick={handleToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
            {recording ? 'Stop' : 'Record'}
        </button>
    );
};

export default SpeechToText;
