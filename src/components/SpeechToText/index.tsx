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
    const fullTranscriptRef = useRef(''); // ✅ persist across runs

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

        fullTranscriptRef.current = ''; // reset on new start

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                fullTranscriptRef.current +=
                    event.results[i][0].transcript + ' ';
            }
        };

        recognition.onend = () => {
            setRecording(false);
            const finalTranscript = fullTranscriptRef.current.trim();
            if (finalTranscript) {
                onResult(finalTranscript);
            }
            fullTranscriptRef.current = '';
        };

        recognition.onerror = () => {
            setRecording(false);
        };

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
