import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Sparkles,
  MessageCircle,
  Headphones,
  Zap
} from 'lucide-react';

interface VoiceAIAssistantProps {
  userRole?: 'client' | 'admin' | 'crew' | 'management' | 'sales';
}

const knowledgeBase = {
  client: {
    responses: {
      'book': 'To book an emergency clearance, go to Book a Move, select Emergency Clearance, choose 24 hour SLA, fill in your property details, and submit. You will get instant crew assignment.',
      'track': 'Track your jobs in real-time by visiting Job History. You can see crew GPS location, photo updates, and completion status for all your active jobs.',
      'invoice': 'Download invoices by going to Reports and Invoices, select your job, then click Download PDF. All invoices include compliance certificates.',
      'payment': 'We accept bank transfers, credit and debit cards, Apple Pay, Google Pay, and monthly invoicing for council contracts.',
      'cancel': 'To cancel your booking, contact support immediately. Free cancellation if done 24 hours in advance.',
      'help': 'I am your AI assistant for client operations. I can help you with booking moves, tracking jobs, downloading invoices, payment methods, and cancellations.',
      'emergency': 'For emergency clearance, book through Book a Move with 24 hour SLA. You will get immediate crew assignment and real-time tracking.',
      'status': 'Check your job status in Job History where you can see real-time updates, crew location, and photo documentation.'
    }
  }
};

export const VoiceAIAssistant: React.FC<VoiceAIAssistantProps> = ({ userRole = 'client' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      if ("webkitSpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setLastQuestion(transcript);
          handleVoiceInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          speakText("Sorry, I couldn't hear you clearly. Please try again.");
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = generateResponse(transcript);
    setCurrentResponse(response);
    setIsProcessing(false);
    
    // Speak the response
    speakText(response);
  };

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    const responses = knowledgeBase[userRole]?.responses || knowledgeBase.client.responses;
    
    // Find matching keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }
    
    // Default response
    return `I understand you're asking about "${input}". I'm here to help with your ${userRole} operations. You can ask me about booking moves, tracking jobs, invoices, payments, or cancellations.`;
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      speakText("Voice recognition is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
    }

    setIsListening(true);
    setCurrentResponse('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Voice AI Assistant</h1>
          </div>
          <p className="text-lg text-gray-600">Ask me anything about your {userRole} operations</p>
        </motion.div>

        {/* Main Voice Interface */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Voice Visualizer */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              className="relative"
              animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
            >
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 shadow-lg shadow-red-200' 
                  : isSpeaking 
                    ? 'bg-blue-500 shadow-lg shadow-blue-200'
                    : isProcessing
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200'
                      : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-12 h-12 text-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <Mic className="w-12 h-12 text-gray-600" />
                )}
              </div>
              
              {/* Pulse animation for listening */}
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-red-300"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              
              {/* Pulse animation for speaking */}
              {isSpeaking && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-blue-300"
                  animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.div>
          </div>

          {/* Status Text */}
          <div className="text-center mb-6">
            <AnimatePresence mode="wait">
              {isListening && (
                <motion.p
                  key="listening"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-semibold text-red-600"
                >
                  🎤 Listening... Ask me anything!
                </motion.p>
              )}
              {isProcessing && (
                <motion.p
                  key="processing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-semibold text-yellow-600"
                >
                  🤔 Processing your question...
                </motion.p>
              )}
              {isSpeaking && (
                <motion.p
                  key="speaking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-semibold text-blue-600"
                >
                  🗣️ AI is speaking...
                </motion.p>
              )}
              {!isListening && !isProcessing && !isSpeaking && (
                <motion.p
                  key="ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg text-gray-600"
                >
                  Click the microphone to start asking questions
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 inline mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 inline mr-2" />
                  Start Listening
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-6 py-4 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105"
              >
                <VolumeX className="w-5 h-5 inline mr-2" />
                Stop Speaking
              </button>
            )}
          </div>
        </div>

        {/* Last Question & Response */}
        <AnimatePresence>
          {(lastQuestion || currentResponse) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
            >
              {lastQuestion && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Your Question:</p>
                  <p className="text-gray-900">{lastQuestion}</p>
                </div>
              )}
              
              {currentResponse && (
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">AI Response:</p>
                  <p className="text-gray-900">{currentResponse}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Quick Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Ask about booking moves</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Track your jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Download invoices</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Payment methods</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};