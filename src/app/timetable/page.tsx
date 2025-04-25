"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { downloadSubjectsAsExcel } from "@/lib/excel-utils";
import { downloadSubjectsAsPDF } from "@/lib/pdf-utils";

interface Subject {
  id: string;
  name: string;
  teacher: string;
  weeklyHours: number;
}

interface TimeSlot {
  day: string;
  period: number;
  subject: string;
  teacher: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = Array.from({ length: 8 }, (_, i) => i + 1);

export default function TimetablePage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<Omit<Subject, "id">>({
    name: "",
    teacher: "",
    weeklyHours: 1,
  });
  const [timetable, setTimetable] = useState<TimeSlot[]>([]);

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.teacher) return;

    const subject: Subject = {
      ...newSubject,
      id: Date.now().toString(),
    };

    setSubjects([...subjects, subject]);
    setNewSubject({
      name: "",
      teacher: "",
      weeklyHours: 1,
    });
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const prefillDemoValues = () => {
    const demoSubjects: Subject[] = [
      { id: "1", name: "Mathematics", teacher: "Dr. Smith", weeklyHours: 5 },
      { id: "2", name: "Physics", teacher: "Prof. Johnson", weeklyHours: 4 },
      { id: "3", name: "Chemistry", teacher: "Mrs. Davis", weeklyHours: 4 },
      { id: "4", name: "Biology", teacher: "Mr. Wilson", weeklyHours: 3 },
      { id: "5", name: "English", teacher: "Ms. Thompson", weeklyHours: 5 },
      { id: "6", name: "History", teacher: "Dr. Brown", weeklyHours: 3 },
      { id: "7", name: "Geography", teacher: "Mr. Miller", weeklyHours: 2 },
      { id: "8", name: "Computer Science", teacher: "Mrs. Clark", weeklyHours: 3 },
      { id: "9", name: "Physical Education", teacher: "Coach Harris", weeklyHours: 2 },
      { id: "10", name: "Art", teacher: "Ms. White", weeklyHours: 2 },
    ];

    setSubjects(demoSubjects);
  };

  const downloadExcel = () => {
    // Generate and download the Excel file directly from the browser
    const today = new Date().toISOString().split('T')[0];
    downloadSubjectsAsExcel(subjects, `subjects-${today}.xlsx`);
  };

  const downloadPDF = () => {
    // Generate and download the PDF file directly from the browser
    const today = new Date().toISOString().split('T')[0];
    downloadSubjectsAsPDF(subjects, `subjects-${today}.pdf`, "Subject List");
  };

  const goToChat = () => {
    // Store subjects in localStorage or state management before navigating
    localStorage.setItem("timetableSubjects", JSON.stringify(subjects));
    router.push("/chat");
  };

  const viewTimetable = () => {
    // Store subjects in localStorage before navigating
    localStorage.setItem("timetableSubjects", JSON.stringify(subjects));
    router.push("/timetable/view");
  };

  const autoGenerateTimetable = () => {
    // Store subjects in localStorage before navigating
    localStorage.setItem("timetableSubjects", JSON.stringify(subjects));
    // Navigate to the view page with auto-generate flag
    router.push("/timetable/view?auto=true");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Timetable</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Subjects</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. Mathematics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Name
              </label>
              <input
                type="text"
                value={newSubject.teacher}
                onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Hours
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newSubject.weeklyHours}
                onChange={(e) => setNewSubject({ ...newSubject, weeklyHours: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Subject
            </button>
            <button
              onClick={prefillDemoValues}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Prefill Demo Values
            </button>
          </div>
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Added Subjects</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weekly Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{subject.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subject.teacher}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subject.weeklyHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveSubject(subject.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Timetable Preview (Sample)</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {PERIODS.map((period) => (
                    <tr key={period} className={period === 4 ? "bg-blue-50" : ""}>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {period === 4 ? `${period} (Lunch after)` : period}
                      </td>
                      {DAYS.map((day) => (
                        <td key={`${day}-${period}`} className="px-4 py-3 whitespace-nowrap">
                          <div className="min-h-[30px]">
                            {/* This would show the subject for this time slot */}
                            {period === 4 && day === "Monday"
                              ? "Mathematics (Dr. Smith)"
                              : period === 2 && day === "Tuesday"
                              ? "Physics (Prof. Johnson)"
                              : period === 3 && day === "Wednesday"
                              ? "English (Ms. Thompson)"
                              : period === 1 && day === "Thursday"
                              ? "Chemistry (Mrs. Davis)"
                              : period === 6 && day === "Friday"
                              ? "Biology (Mr. Wilson)"
                              : ""}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            * This is just a sample preview. The actual timetable will be generated with AI assistance.
          </div>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <div className="relative inline-block">
            <button
              onClick={() => document.getElementById('exportDropdown')?.classList.toggle('hidden')}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export Data
            </button>
            <div id="exportDropdown" className="hidden absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={downloadExcel}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Download as Excel (.xlsx)
                </button>
                <button
                  onClick={downloadPDF}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Download as PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Print Subject List
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={viewTimetable}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            View & Edit Timetable
          </button>
          <button
            onClick={autoGenerateTimetable}
            className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Auto-Generate Timetable
          </button>
          <button
            onClick={goToChat}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to AI Assistant
          </button>
        </div>
      )}
    </div>
  );
} 