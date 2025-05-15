// utils/speechReader.ts
import stringSimilarity from 'string-similarity';

const expectedText = `This is sentence one. This is sentence two. This is sentence three.`;
const silenceThreshold = 2000; // 2 seconds
const matchThreshold = 0.85;

let recognition: SpeechRecognition;
let lastSpeechTime: number = 0;
let transcript: string = '';
let isRecognizing = false;

export function startListening(onReadingComplete: () => void) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      const text = result[0].transcript.trim();
      if (result.isFinal) {
        transcript += text + ' ';
      } else {
        interimTranscript += text + ' ';
      }
    }

    lastSpeechTime = Date.now();

    checkIfDone(onReadingComplete);
  };

  recognition.onstart = () => {
    isRecognizing = true;
    transcript = '';
    lastSpeechTime = Date.now();
  };

  recognition.onend = () => {
    isRecognizing = false;
    checkIfDone(onReadingComplete);
  };

  recognition.start();
}

function checkIfDone(callback: () => void) {
  const now = Date.now();
  const timeSinceLastSpeech = now - lastSpeechTime;

  const matchScore = stringSimilarity.compareTwoStrings(transcript.trim().toLowerCase(), expectedText.trim().toLowerCase());

  if (matchScore > matchThreshold && timeSinceLastSpeech > silenceThreshold) {
    recognition.stop(); // Stop recognition
    callback();
  }
}
