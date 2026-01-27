import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceAssistantProps {
  userRole?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ userRole = 'user' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;
  }, []);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';

    // Common help responses based on user role and command
    if (lowerCommand.includes('book') || lowerCommand.includes('create job')) {
      response = userRole === 'client' ? 'To book a move, click on Book Move in your dashboard. Select your service type, enter property details, and choose your SLA.' : 'You can create new jobs from the Create Job section in your admin dashboard.';
    } else if (lowerCommand.includes('track') || lowerCommand.includes('status')) {
      response = 'You can track job status in the Job History section. Click on any job to see real-time updates and crew location.';
    } else if (lowerCommand.includes('payment') || lowerCommand.includes('invoice')) {
      response = 'Payment and invoice information is available in the Reports & Invoices section of your dashboard.';
    } else if (lowerCommand.includes('crew') || lowerCommand.includes('assign')) {
      response = userRole === 'admin' ? 'To assign crew, go to Assign Crew section, select available crew members, and assign them to jobs based on location and availability.' : 'For crew-related queries, please contact your administrator.';
    } else if (lowerCommand.includes('sla') || lowerCommand.includes('deadline')) {
      response = 'SLA deadlines are automatically calculated. 24-hour emergency jobs have priority. You can monitor SLA compliance in the SLA Monitoring section.';
    } else if (lowerCommand.includes('help') || lowerCommand.includes('support')) {
      response = 'I can help you with booking jobs, tracking status, payments, crew management, and SLA monitoring. What would you like to know?';
    } else {
      response = 'I can help you with booking moves, tracking jobs, payments, crew management, and SLA monitoring. Please ask me about any of these topics.';
    }

    setResponse(response);
    speak(response);
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Voice Assistant Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Voice Assistant</h3>
                    <p className="text-sm text-gray-600">Ask me anything about the platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Voice Controls */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isSpeaking}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isListening
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                    }`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    {isListening ? 'Stop' : 'Speak'}
                  </button>
                  
                  <button
                    onClick={isSpeaking ? stopSpeaking : () => speak(response || 'Hello! How can I help you today?')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSpeaking
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    {isSpeaking ? 'Stop' : 'Speak'}
                  </button>
                </div>

                {/* Status Indicator */}
                {isListening && (
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="inline-flex items-center gap-2 text-red-600 font-semibold"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Listening...
                    </motion.div>
                  </div>
                )}

                {isSpeaking && (
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-flex items-center gap-2 text-green-600 font-semibold"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Speaking...
                    </motion.div>
                  </div>
                )}

                {/* Transcript */}
                {transcript && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-blue-800 mb-1">You said:</p>
                    <p className="text-sm text-blue-700">{transcript}</p>
                  </div>
                )}

                {/* Response */}
                {response && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-green-800 mb-1">Assistant:</p>
                    <p className="text-sm text-green-700">{response}</p>
                  </div>
                )}

                {/* Quick Help Topics */}
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Quick Help Topics:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Book a move',
                      'Track jobs',
                      'View payments',
                      'Assign crew',
                      'SLA monitoring',
                      'General help'
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setTranscript(topic);
                          handleVoiceCommand(topic);
                        }}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-all"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};