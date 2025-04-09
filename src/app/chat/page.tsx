"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { downloadSubjectsAsExcel } from "@/lib/excel-utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Subject {
  id: string;
  name: string;
  teacher: string;
  weeklyHours: number;
}

// REPLACE_THIS_WITH_YOUR_ACTUAL_API_KEY
const GROQ_API_KEY = "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";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI timetable assistant. You can ask me questions about your timetable, such as 'Are there any free periods on Monday?' or 'When should I teach Physics?'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load subjects from localStorage if available
    const storedSubjects = localStorage.getItem("timetableSubjects");
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare the timetable data for the AI
      const timetableContext = {
        subjects,
        periods: Array.from({ length: 8 }, (_, i) => i + 1),
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        lunchAfterPeriod: 4
      };

      // Prepare the chat history for the AI
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add the new user message
      chatHistory.push({
        role: "user",
        content: input
      });

      // Prepare the system message with context
      const systemMessage = {
        role: "system",
        content: `You are an AI assistant helping with school timetable scheduling. 
        Here is the current timetable data: ${JSON.stringify(timetableContext)}. 
        Answer questions about free periods, when to teach subjects, and lunch breaks.
        Always be helpful and concise. If someone asks about downloading, tell them to use the download button.
        The lunch break is after period 4 every day. There are 8 periods per day.`
      };

      // Final messages array with system context
      const aiMessages = [systemMessage, ...chatHistory];

      // Make the API call to Groq
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          messages: aiMessages,
          model: "llama-3.2-90b-vision-preview",
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error calling AI API:", error);
      
      // Fallback response in case of error
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again later.",
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = () => {
    const today = new Date().toISOString().split('T')[0];
    downloadSubjectsAsExcel(subjects, `subjects-${today}.xlsx`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Timetable Assistant</h1>

      {subjects.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            You haven't added any subjects to your timetable yet. 
            <Link href="/timetable" className="font-medium text-blue-600 ml-2 hover:underline">
              Create a timetable first
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800">
            You have {subjects.length} subjects added to your timetable.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about your timetable..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Example questions: "Are there any free periods on Monday?", "When should I teach Physics?"
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setInput("Are there any free periods?");
              handleSendMessage();
            }}
            className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Free periods?
          </button>
          <button
            onClick={() => {
              setInput("When should I teach Mathematics?");
              handleSendMessage();
            }}
            className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            When to teach Math?
          </button>
          <button
            onClick={() => {
              setInput("What time is lunch break?");
              handleSendMessage();
            }}
            className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Lunch break?
          </button>
          <button
            onClick={() => {
              setInput("How do I download my timetable?");
              handleSendMessage();
            }}
            className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Download timetable?
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link
          href="/timetable"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Timetable
        </Link>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Download as Excel
        </button>
      </div>
    </div>
  );
} 