import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Search,
  BookOpen,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Loader2,
  Package,
  Truck,
  Calendar,
  MapPin,
  Users,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: () => void }>;
}

interface AIKnowledgeBase {
  [key: string]: {
    quickActions: string[];
    faqs: Array<{ question: string; answer: string; category: string }>;
    commonTasks: Array<{ task: string; steps: string[]; icon: any }>;
  };
}

const aiKnowledge: AIKnowledgeBase = {
  client: {
    quickActions: [
      "Book emergency clearance",
      "Track my jobs",
      "Download invoices",
      "Payment methods",
      "Cancel booking",
      "Coverage areas"
    ],
    faqs: [
      {
        question: "How do I book an emergency clearance?",
        answer: "Go to 'Book a Move' → Select 'Emergency Clearance' → Choose 24h SLA → Fill property details → Submit. You'll get instant crew assignment.",
        category: "booking"
      },
      {
        question: "How do I track my jobs?",
        answer: "Visit 'Job History' to see real-time updates, crew GPS location, photo updates, and completion status for all your jobs.",
        category: "tracking"
      },
      {
        question: "How do I download invoices?",
        answer: "Go to 'Reports & Invoices' → Select your job → Click 'Download PDF'. All invoices include compliance certificates.",
        category: "billing"
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept: Bank transfers, Credit/Debit cards, Apple Pay, Google Pay, and monthly invoicing for council contracts.",
        category: "billing"
      },
      {
        question: "Can I modify or cancel my booking?",
        answer: "Yes! Contact support immediately. Free cancellation if done 24+ hours in advance. Modifications depend on crew availability.",
        category: "booking"
      }
    ],
    commonTasks: [
      {
        task: "Book Emergency Service",
        steps: ["Go to Book a Move", "Select Emergency Clearance", "Choose 24h SLA", "Enter property address", "Upload photos", "Submit booking"],
        icon: Package
      },
      {
        task: "Track Job Progress",
        steps: ["Go to Job History", "Select active job", "View real-time updates", "Check crew location", "See photo updates"],
        icon: MapPin
      }
    ]
  },
  admin: {
    quickActions: [
      "Assign crew to job",
      "Monitor SLA breaches",
      "Approve crew members",
      "Generate reports",
      "Manage user accounts",
      "System settings"
    ],
    faqs: [
      {
        question: "How do I assign crew to urgent jobs?",
        answer: "Go to 'Assign Crew' → Select pending job → Choose available crew → Confirm assignment. System auto-suggests best matches.",
        category: "operations"
      },
      {
        question: "How do I monitor SLA compliance?",
        answer: "Visit 'SLA Monitoring' for real-time dashboard showing job deadlines, breach alerts, and performance metrics.",
        category: "monitoring"
      },
      {
        question: "How do I approve new crew members?",
        answer: "Go to 'User Approvals' → Review crew applications → Check documents → Approve/Reject with comments.",
        category: "management"
      }
    ],
    commonTasks: [
      {
        task: "Assign Crew to Job",
        steps: ["Go to Assign Crew", "Select pending job", "Choose available crew", "Set vehicle", "Confirm assignment"],
        icon: Users
      },
      {
        task: "Monitor SLA Performance",
        steps: ["Go to SLA Monitoring", "Check breach alerts", "Review job timelines", "Take corrective action"],
        icon: Clock
      }
    ]
  },
  crew: {
    quickActions: [
      "View assigned jobs",
      "Update job status",
      "Upload completion photos",
      "Check earnings",
      "Report issues",
      "Navigation help"
    ],
    faqs: [
      {
        question: "How do I update job status?",
        answer: "In 'Job Details' → Tap status button → Select new status → Add notes → Upload photos → Confirm update.",
        category: "workflow"
      },
      {
        question: "How do I upload completion photos?",
        answer: "Go to active job → Tap 'Upload Photos' → Take before/after photos → Add descriptions → Submit for approval.",
        category: "documentation"
      },
      {
        question: "How do I check my earnings?",
        answer: "Visit 'Crew Earnings' to see daily/weekly/monthly earnings, job payments, and performance bonuses.",
        category: "earnings"
      }
    ],
    commonTasks: [
      {
        task: "Complete Job Workflow",
        steps: ["Accept job", "Navigate to property", "Take before photos", "Complete clearance", "Take after photos", "Mark complete"],
        icon: Truck
      },
      {
        task: "Upload Job Photos",
        steps: ["Open active job", "Tap Upload Photos", "Take before/after shots", "Add descriptions", "Submit"],
        icon: Package
      }
    ]
  },
  management: {
    quickActions: [
      "View team performance",
      "Generate analytics",
      "Review KPIs",
      "Manage resources",
      "Strategic planning",
      "Cost analysis"
    ],
    faqs: [
      {
        question: "How do I view team performance metrics?",
        answer: "Go to 'Team Performance' for comprehensive analytics on crew efficiency, job completion rates, and customer satisfaction.",
        category: "analytics"
      },
      {
        question: "How do I generate business reports?",
        answer: "Visit 'Management Dashboard' → Select report type → Choose date range → Generate PDF/Excel reports.",
        category: "reporting"
      }
    ],
    commonTasks: [
      {
        task: "Review Team Performance",
        steps: ["Go to Team Performance", "Select time period", "Analyze metrics", "Identify improvements"],
        icon: BarChart3
      }
    ]
  },
  sales: {
    quickActions: [
      "Manage leads pipeline",
      "Track conversions",
      "Client communications",
      "Quote generation",
      "Follow-up reminders",
      "Revenue tracking"
    ],
    faqs: [
      {
        question: "How do I manage the leads pipeline?",
        answer: "Go to 'Leads Pipeline' to track prospects from initial contact through conversion, with automated follow-up reminders.",
        category: "sales"
      },
      {
        question: "How do I generate quotes for clients?",
        answer: "Visit 'Sales Clients' → Select prospect → Use quote builder → Send via email → Track response status.",
        category: "quoting"
      }
    ],
    commonTasks: [
      {
        task: "Convert Lead to Client",
        steps: ["Go to Leads Pipeline", "Select hot lead", "Generate quote", "Send proposal", "Follow up", "Close deal"],
        icon: Users
      }
    ]
  }
};

interface AISupportInterfaceProps {
  userRole?: 'client' | 'admin' | 'crew' | 'management' | 'sales';
}

export const AISupportInterface: React.FC<AISupportInterfaceProps> = ({ userRole = 'client' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentKnowledge = aiKnowledge[userRole];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const generateAIResponse = (input: string): { content: string; actions?: Array<{ label: string; action: () => void }> } => {
    const lowerInput = input.toLowerCase();
    
    // Role-specific responses
    if (userRole === 'client') {
      if (lowerInput.includes('book') || lowerInput.includes('emergency')) {
        return {
          content: "To book an emergency clearance: Go to 'Book a Move' → Select 'Emergency Clearance' → Choose 24h SLA → Fill property details → Submit. You'll get instant crew assignment and tracking.",
          actions: [{ label: "Go to Book a Move", action: () => window.location.href = '/client/book' }]
        };
      }
      if (lowerInput.includes('track') || lowerInput.includes('job')) {
        return {
          content: "Track your jobs in real-time: Visit 'Job History' to see crew GPS location, photo updates, and completion status for all your active jobs.",
          actions: [{ label: "View Job History", action: () => window.location.href = '/client/history' }]
        };
      }
      if (lowerInput.includes('invoice') || lowerInput.includes('report')) {
        return {
          content: "Download invoices and reports: Go to 'Reports & Invoices' → Select your job → Click 'Download PDF'. All invoices include compliance certificates.",
          actions: [{ label: "View Reports", action: () => window.location.href = '/client/reports' }]
        };
      }
    }
    
    if (userRole === 'admin') {
      if (lowerInput.includes('assign') || lowerInput.includes('crew')) {
        return {
          content: "Assign crew to jobs: Go to 'Assign Crew' → Select pending job → Choose available crew → Confirm assignment. System auto-suggests best matches based on location and skills.",
          actions: [{ label: "Assign Crew", action: () => window.location.href = '/admin/assign-crew' }]
        };
      }
      if (lowerInput.includes('sla') || lowerInput.includes('monitor')) {
        return {
          content: "Monitor SLA compliance: Visit 'SLA Monitoring' for real-time dashboard showing job deadlines, breach alerts, and performance metrics.",
          actions: [{ label: "SLA Dashboard", action: () => window.location.href = '/admin/sla' }]
        };
      }
    }
    
    if (userRole === 'crew') {
      if (lowerInput.includes('job') || lowerInput.includes('status')) {
        return {
          content: "Update job status: In 'Job Details' → Tap status button → Select new status → Add notes → Upload photos → Confirm update. Keep clients informed!",
          actions: [{ label: "View Jobs", action: () => window.location.href = '/crew/jobs' }]
        };
      }
      if (lowerInput.includes('photo') || lowerInput.includes('upload')) {
        return {
          content: "Upload completion photos: Go to active job → Tap 'Upload Photos' → Take before/after photos → Add descriptions → Submit for approval.",
          actions: [{ label: "Current Jobs", action: () => window.location.href = '/crew/workflow' }]
        };
      }
    }
    
    // Generic AI response
    return {
      content: `I understand you're asking about "${input}". As your AI assistant for ${userRole} operations, I'm here to help you navigate the platform efficiently. Would you like me to guide you through specific tasks or answer questions about your role?`
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
        actions: aiResponse.actions
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
      speakText(aiResponse.content);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const filteredFAQs = currentKnowledge.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin': return Shield;
      case 'crew': return Truck;
      case 'management': return BarChart3;
      case 'sales': return Users;
      default: return Package;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 overflow-hidden">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">AI Support Center</h2>
            <div className="ml-auto flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <RoleIcon className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium capitalize">{userRole}</span>
            </div>
          </motion.div>
          <p className="text-blue-100">Get instant help with voice or text - powered by AI for {userRole} operations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b">
          {[
            { id: 'chat', label: 'AI Chat', icon: MessageSquare },
            { id: 'tasks', label: 'Quick Tasks', icon: Settings },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'contact', label: 'Contact', icon: Phone },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="h-[400px] border rounded-lg bg-gray-50 p-4 overflow-y-auto" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">Start a conversation or try a quick action below</p>
                    <p className="text-sm text-gray-500 mt-2">I'm specialized in {userRole} operations and can help you navigate the platform</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.actions && (
                            <div className="mt-2 space-y-1">
                              {message.actions.map((action, idx) => (
                                <button
                                  key={idx}
                                  onClick={action.action}
                                  className="block w-full text-left px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-all"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white border rounded-lg p-3">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Ask me about ${userRole} operations...`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={toggleVoiceInput}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentKnowledge.quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common {userRole} Tasks</h3>
              <div className="grid gap-4">
                {currentKnowledge.commonTasks.map((task, index) => {
                  const Icon = task.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{task.task}</h4>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {task.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-semibold">
                                  {stepIndex + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${userRole} FAQs...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="h-[500px] overflow-y-auto space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-lg p-4 border"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 mt-1 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{faq.answer}</p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {faq.category}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                    <p className="text-sm text-gray-600">24/7 Emergency Line</p>
                  </div>
                </div>
                <p className="font-bold text-lg text-green-700">+44 20 7641 6000</p>
                <p className="text-xs text-gray-600 mt-2">Available anytime</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600">Response within 2 hours</p>
                  </div>
                </div>
                <p className="font-bold text-lg text-blue-700">support@ukpackers.co.uk</p>
                <p className="text-xs text-gray-600 mt-2">Professional assistance</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Documentation</h3>
                    <p className="text-sm text-gray-600">Browse our guides</p>
                  </div>
                </div>
                <button className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                  View {userRole} Guides
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Support Hours for {userRole} Users
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Emergency Support</p>
            <p className="text-sm text-gray-600">24/7 - Available anytime</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Technical Support</p>
            <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">AI Assistant</p>
            <p className="text-sm text-gray-600">Always available - Instant responses</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Average Response</p>
            <p className="text-sm text-gray-600">AI: Instant | Human: 15 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};