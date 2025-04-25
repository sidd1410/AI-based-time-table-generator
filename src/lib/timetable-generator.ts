interface Subject {
  id: string;
  name: string;
  teacher: string;
  weeklyHours: number;
  color?: string;
}

interface TimeSlot {
  day: string;
  period: number;
  subjectId: string | null;
  subject: string;
  teacher: string;
}

type TimetableGrid = (TimeSlot | null)[][];

// Generate a consistent color based on string input
export const generateColor = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use pastel colors for better readability
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`;
};

// Add colors to subjects if they don't already have them
export const addColorsToSubjects = (subjects: Subject[]): Subject[] => {
  return subjects.map(subject => {
    if (!subject.color) {
      return {
        ...subject,
        color: generateColor(subject.name)
      };
    }
    return subject;
  });
};

// Generate automated timetable
export const generateTimetable = (
  subjects: Subject[],
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periodsPerDay: number = 8,
  lunchAfterPeriod: number = 4
): TimetableGrid => {
  // Initialize empty timetable grid
  const timetable: TimetableGrid = Array(periodsPerDay)
    .fill(null)
    .map(() => Array(days.length).fill(null));

  // Add colors to subjects
  const coloredSubjects = addColorsToSubjects(subjects);
  
  // Create a map to track teacher assignments
  const teacherAssignments: Record<string, { day: number; period: number }[]> = {};
  
  // Create a map to track remaining hours for each subject
  const remainingHours: Record<string, number> = {};
  
  // Initialize tracking maps
  coloredSubjects.forEach(subject => {
    teacherAssignments[subject.teacher] = [];
    remainingHours[subject.id] = subject.weeklyHours;
  });

  // Sort subjects by weekly hours (descending) to prioritize subjects with more hours
  const sortedSubjects = [...coloredSubjects].sort((a, b) => 
    b.weeklyHours - a.weeklyHours
  );

  // First pass: Distribute subjects evenly across days
  for (const subject of sortedSubjects) {
    // Skip if no hours to assign
    if (remainingHours[subject.id] <= 0) continue;
    
    // Try to assign one period per day first (when possible)
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      if (remainingHours[subject.id] <= 0) break;
      
      // Find a suitable period for this subject on this day
      for (let periodIndex = 0; periodIndex < periodsPerDay; periodIndex++) {
        // Skip lunch period
        if (periodIndex === lunchAfterPeriod - 1) continue;
        
        // Skip if slot is already filled
        if (timetable[periodIndex][dayIndex] !== null) continue;
        
        // Check if teacher is already assigned in this period on this day
        const isTeacherBusy = teacherAssignments[subject.teacher].some(
          assignment => assignment.day === dayIndex && assignment.period === periodIndex
        );
        
        if (!isTeacherBusy) {
          // Assign subject to this slot
          timetable[periodIndex][dayIndex] = {
            day: days[dayIndex],
            period: periodIndex + 1,
            subjectId: subject.id,
            subject: subject.name,
            teacher: subject.teacher
          };
          
          // Update tracking
          teacherAssignments[subject.teacher].push({ day: dayIndex, period: periodIndex });
          remainingHours[subject.id]--;
          break;
        }
      }
    }
  }
  
  // Second pass: Fill in remaining hours
  for (const subject of sortedSubjects) {
    // Continue assigning until no hours left
    while (remainingHours[subject.id] > 0) {
      let assigned = false;
      
      // Try each period and day
      for (let periodIndex = 0; periodIndex < periodsPerDay; periodIndex++) {
        // Skip lunch period
        if (periodIndex === lunchAfterPeriod - 1) continue;
        
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
          // Skip if slot is already filled
          if (timetable[periodIndex][dayIndex] !== null) continue;
          
          // Check if teacher is already assigned in this period on this day
          const isTeacherBusy = teacherAssignments[subject.teacher].some(
            assignment => assignment.day === dayIndex && assignment.period === periodIndex
          );
          
          if (!isTeacherBusy) {
            // Assign subject to this slot
            timetable[periodIndex][dayIndex] = {
              day: days[dayIndex],
              period: periodIndex + 1,
              subjectId: subject.id,
              subject: subject.name,
              teacher: subject.teacher
            };
            
            // Update tracking
            teacherAssignments[subject.teacher].push({ day: dayIndex, period: periodIndex });
            remainingHours[subject.id]--;
            assigned = true;
            break;
          }
        }
        
        if (assigned || remainingHours[subject.id] <= 0) break;
      }
      
      // If we couldn't assign a period, break to avoid infinite loop
      if (!assigned) break;
    }
  }
  
  return timetable;
};

// Convert the generated timetable to the Cell[][] format used by the ExcelPreview component
export const timetableToExcelData = (
  timetable: TimetableGrid,
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  subjects: Subject[] = []
) => {
  // Create a map of subjects by ID for quick lookup
  const subjectMap = subjects.reduce((map, subject) => {
    map[subject.id] = subject;
    return map;
  }, {} as Record<string, Subject>);
  
  // Create header row
  const headerRow = [
    { value: "Period/Day", editable: false, highlighted: true },
    ...days.map(day => ({ value: day, editable: false, highlighted: true }))
  ];
  
  // Create data rows
  const dataRows = timetable.map((row, periodIndex) => {
    const periodNum = periodIndex + 1;
    const isLunchPeriod = periodNum === 4;
    
    return [
      {
        value: isLunchPeriod ? `Period ${periodNum} (Lunch after)` : `Period ${periodNum}`,
        editable: false,
        highlighted: isLunchPeriod
      },
      ...row.map(slot => {
        if (!slot) {
          return {
            value: "",
            editable: true,
            highlighted: isLunchPeriod
          };
        }
        
        // Get subject color if available
        const subject = slot.subjectId ? subjectMap[slot.subjectId] : null;
        const color = subject?.color;
        
        return {
          value: `${slot.subject} (${slot.teacher})`,
          editable: true,
          highlighted: isLunchPeriod,
          color
        };
      })
    ];
  });
  
  return [headerRow, ...dataRows];
}; 