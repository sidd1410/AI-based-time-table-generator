"use client";

import { useState, useEffect } from "react";

interface Subject {
  id: string;
  name: string;
  teacher: string;
  weeklyHours: number;
  color?: string;
}

interface Cell {
  value: string;
  editable?: boolean;
  highlighted?: boolean;
  color?: string;
}

interface TimetableStatsProps {
  timetableData: Cell[][];
  subjects: Subject[];
}

interface TeacherStats {
  name: string;
  totalHours: number;
  dailyHours: Record<string, number>;
  subjects: string[];
}

interface SubjectStats {
  name: string;
  totalHours: number;
  teacher: string;
}

interface DayStats {
  name: string;
  filledSlots: number;
  emptySlots: number;
  utilization: number;
}

// The days of the week in order
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function TimetableStats({ timetableData, subjects }: TimetableStatsProps) {
  const [teacherStats, setTeacherStats] = useState<TeacherStats[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [dayStats, setDayStats] = useState<DayStats[]>([]);
  const [totalUtilization, setTotalUtilization] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);

  useEffect(() => {
    if (!timetableData || timetableData.length < 2) return;
    
    // Teacher stats map
    const teacherStatsMap: Record<string, TeacherStats> = {};
    
    // Subject stats map
    const subjectStatsMap: Record<string, SubjectStats> = {};
    
    // Day stats - initialize with empty data
    const dayStatsMap: Record<string, DayStats> = {};
    DAYS.forEach((day, index) => {
      dayStatsMap[day] = {
        name: day,
        filledSlots: 0,
        emptySlots: 0,
        utilization: 0
      };
    });
    
    // Track conflicts
    let conflicts = 0;
    
    // Skip header row
    const dataRows = timetableData.slice(1);
    
    // Process each cell in the timetable
    dataRows.forEach((row, rowIndex) => {
      // Skip the first column (period labels)
      const cells = row.slice(1);
      
      // Process each day column
      cells.forEach((cell, colIndex) => {
        const day = DAYS[colIndex];
        
        // Check if cell is filled
        if (cell.value.trim() !== "") {
          dayStatsMap[day].filledSlots++;
          
          // Extract teacher and subject from cell value
          // Format is usually "Subject (Teacher)"
          const match = cell.value.match(/(.+)\s*\((.+)\)/);
          if (match) {
            const subject = match[1].trim();
            const teacher = match[2].trim();
            
            // Update teacher stats
            if (!teacherStatsMap[teacher]) {
              teacherStatsMap[teacher] = {
                name: teacher,
                totalHours: 0,
                dailyHours: {},
                subjects: []
              };
              DAYS.forEach(d => teacherStatsMap[teacher].dailyHours[d] = 0);
            }
            
            teacherStatsMap[teacher].totalHours++;
            teacherStatsMap[teacher].dailyHours[day]++;
            
            if (!teacherStatsMap[teacher].subjects.includes(subject)) {
              teacherStatsMap[teacher].subjects.push(subject);
            }
            
            // Update subject stats
            if (!subjectStatsMap[subject]) {
              subjectStatsMap[subject] = {
                name: subject,
                totalHours: 0,
                teacher
              };
            }
            
            subjectStatsMap[subject].totalHours++;
            
            // Check for teacher conflicts in the same period
            const periodConflicts = dataRows
              .filter((_, i) => i === rowIndex) // Same period
              .flatMap(r => r.slice(1)) // All days
              .filter((c, i) => i !== colIndex && c.value.includes(teacher));
            
            conflicts += periodConflicts.length;
          }
        } else {
          dayStatsMap[day].emptySlots++;
        }
      });
    });
    
    // Calculate utilization for each day
    Object.keys(dayStatsMap).forEach(day => {
      const total = dayStatsMap[day].filledSlots + dayStatsMap[day].emptySlots;
      dayStatsMap[day].utilization = total > 0 ? (dayStatsMap[day].filledSlots / total) * 100 : 0;
    });
    
    // Calculate overall utilization
    const totalSlots = Object.values(dayStatsMap).reduce(
      (sum, stat) => sum + stat.filledSlots + stat.emptySlots, 
      0
    );
    const filledSlots = Object.values(dayStatsMap).reduce(
      (sum, stat) => sum + stat.filledSlots,
      0
    );
    const overallUtilization = totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0;
    
    // Update state
    setTeacherStats(Object.values(teacherStatsMap));
    setSubjectStats(Object.values(subjectStatsMap));
    setDayStats(Object.values(dayStatsMap));
    setTotalUtilization(overallUtilization);
    setConflictCount(conflicts);
  }, [timetableData, subjects]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Timetable Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Overall stats cards */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-blue-600 font-medium">Total Utilization</div>
          <div className="text-2xl font-bold">{totalUtilization.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Percentage of filled slots</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-green-600 font-medium">Subject Count</div>
          <div className="text-2xl font-bold">{subjectStats.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total subjects scheduled</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-purple-600 font-medium">Teacher Count</div>
          <div className="text-2xl font-bold">{teacherStats.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total teachers scheduled</div>
        </div>
        
        <div className={`p-4 rounded-lg border ${conflictCount > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`text-sm font-medium ${conflictCount > 0 ? 'text-red-600' : 'text-gray-600'}`}>Teacher Conflicts</div>
          <div className="text-2xl font-bold">{conflictCount}</div>
          <div className="text-xs text-gray-500 mt-1">{conflictCount > 0 ? 'Teachers double-booked!' : 'No scheduling conflicts'}</div>
        </div>
      </div>
      
      {/* Day utilization */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Daily Utilization</h3>
        <div className="grid grid-cols-5 gap-2">
          {dayStats.map(day => (
            <div key={day.name} className="text-center">
              <div className="font-medium text-sm">{day.name}</div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold inline-block text-blue-600">
                    {day.utilization.toFixed(0)}%
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-100">
                  <div style={{ width: `${day.utilization}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
                <div className="text-xs text-gray-500">{day.filledSlots} / {day.filledSlots + day.emptySlots} slots</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher allocations */}
      {teacherStats.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Teacher Allocations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Distribution</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teacherStats.map(teacher => (
                  <tr key={teacher.name}>
                    <td className="px-3 py-2 whitespace-nowrap">{teacher.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{teacher.totalHours}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map(subject => (
                          <span key={subject} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-1">
                        {DAYS.map(day => (
                          <div 
                            key={day} 
                            className="flex flex-col items-center"
                            title={`${day}: ${teacher.dailyHours[day]} hours`}
                          >
                            <div className="text-xs text-gray-500">{day.charAt(0)}</div>
                            <div className={`text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full ${
                              teacher.dailyHours[day] > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {teacher.dailyHours[day]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subject distribution */}
      {subjectStats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Subject Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjectStats.map(subject => (
              <div key={subject.name} className="border rounded-lg p-3">
                <div className="font-medium">{subject.name}</div>
                <div className="text-sm text-gray-600 mb-1">{subject.teacher}</div>
                <div className="flex items-center">
                  <div className="text-xs font-medium mr-2">{subject.totalHours} hours</div>
                  <div className="relative flex-1 h-2">
                    <div className="overflow-hidden h-2 flex rounded bg-blue-100">
                      <div 
                        style={{ 
                          width: `${(subject.totalHours / (subjects.find(s => s.name === subject.name)?.weeklyHours || 1)) * 100}%` 
                        }} 
                        className="bg-blue-500 h-2 rounded"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 