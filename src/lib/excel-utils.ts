import * as XLSX from 'xlsx';

interface TimetableCell {
  value: string;
}

export const downloadTimetableAsExcel = (
  timetableData: TimetableCell[][],
  filename: string = 'timetable.xlsx'
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert the data to the format expected by SheetJS
  // Extract just the values from the data
  const data = timetableData.map(row => 
    row.map(cell => cell.value || '')
  );
  
  // Create a worksheet from the data
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
  
  // Generate the Excel file and trigger download
  XLSX.writeFile(wb, filename);
};

export const downloadSubjectsAsExcel = (
  subjects: {
    id: string;
    name: string;
    teacher: string;
    weeklyHours: number;
  }[],
  filename: string = 'subjects.xlsx'
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare headers
  const headers = ['Subject', 'Teacher', 'Weekly Hours'];
  
  // Prepare data including headers
  const data = [
    headers,
    ...subjects.map(subject => [
      subject.name,
      subject.teacher,
      subject.weeklyHours.toString()
    ])
  ];
  
  // Create a worksheet from the data
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Subjects');
  
  // Generate the Excel file and trigger download
  XLSX.writeFile(wb, filename);
}; 