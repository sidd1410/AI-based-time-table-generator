import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          AI-Powered <span className="text-blue-400">Timetable Generator</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mb-8">
          Create optimal timetables effortlessly with our AI assistant. Save time and eliminate scheduling conflicts with intelligent automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/timetable"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Create Timetable
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors"
          >
            AI Assistant
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-slate-600">Add subjects and let the AI generate an optimized timetable with balanced workload.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-slate-600">Chat with our AI to ask questions about free periods, subject scheduling, and more.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Export & Download</h3>
              <p className="text-slate-600">Download your timetable as an Excel file for easy sharing and future reference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© {new Date().getFullYear()} AI Timetable Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
