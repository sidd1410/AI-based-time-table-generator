import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl">
              AI Timetable
            </Link>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
                >
                  Home
                </Link>
                <Link
                  href="/timetable"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
                >
                  Create Timetable
                </Link>
                <Link
                  href="/timetable/view"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
                >
                  View Timetable
                </Link>
                <Link
                  href="/chat"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
                >
                  AI Assistant
                </Link>
              </div>
            </nav>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Main menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 