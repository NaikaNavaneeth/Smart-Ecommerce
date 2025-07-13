import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { keywordToCategoryMap } from '../utils/categoryMap';

const VoiceSearch: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }

    const recognition = recognitionRef.current;
    recognition.lang = state.language === 'hi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      dispatch({ type: 'SET_SEARCH_QUERY', payload: currentTranscript });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    if (state.isVoiceSearchActive) {
      try {
        recognition.start();
      } catch (err) {
        console.warn('Recognition already started or failed to start:', err);
      }
    }

    return () => {
      recognition.stop();
    };
  }, [state.isVoiceSearchActive, state.language, dispatch]);

  useEffect(() => {
    if (transcript) {
      const lower = transcript.toLowerCase();
      const foundKeyword = Object.keys(keywordToCategoryMap).find(keyword => lower.includes(keyword));

      if (foundKeyword) {
        const matchedCategory = keywordToCategoryMap[foundKeyword];
        dispatch({ type: 'SET_CATEGORY_FILTER', payload: matchedCategory });
        dispatch({ type: 'SET_SEARCH_QUERY', payload: foundKeyword });
        console.log('Matched category:', matchedCategory);
      } else {
        console.log('No matching category found for transcript:', transcript);
      }
    }
  }, [transcript]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      dispatch({ type: 'TOGGLE_VOICE_SEARCH' });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleVoiceSearch}
      className={`px-3 py-3 border-2 border-l-0 border-r-0 transition-colors ${
        isListening
          ? 'bg-red-500 text-white border-red-500'
          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
      }`}
    >
      {isListening ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <MicOff className="w-5 h-5" />
        </motion.div>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </motion.button>
  );
};

// Add type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  type SpeechRecognition = typeof window.SpeechRecognition;
  type SpeechRecognitionEvent = any;
  type SpeechRecognitionErrorEvent = any;
}

export default VoiceSearch;