import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

interface Cell {
  value: string;
  editable?: boolean;
  highlighted?: boolean;
  color?: string;
}

// Define a type for the cell style object
interface CellStyle {
  fillColor?: [number, number, number];
}

export const downloadTimetableAsPDF = (
  timetableData: Cell[][],
  filename: string = 'timetable.pdf',
  title: string = 'School Timetable'
) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add creation date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Extract just the values and colors from the data
  const headers = timetableData[0].map(cell => cell.value);
  
  const body = timetableData.slice(1).map(row => {
    return row.map(cell => cell.value);
  });
  
  // Set up color styles for the cells, explicitly typed
  const styles: CellStyle[][] = timetableData.slice(1).map(row => {
    return row.map(cell => {
      const cellStyle: CellStyle = {}; // Explicitly type the object
      if (cell.highlighted && !cell.color) {
        cellStyle.fillColor = [235, 245, 255]; // Light blue for highlighted cells
      }
      if (cell.color) {
        // Convert HSL color to RGB for PDF
        const color = convertHSLtoRGB(cell.color);
        cellStyle.fillColor = color;
      }
      return cellStyle;
    });
  });
  
  // Create the table
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      valign: 'middle',
      halign: 'center',
    },
    headStyles: {
      fillColor: [41, 128, 185], // Blue header
      textColor: 255,
      fontStyle: 'bold',
    },
    willDrawCell: (data) => {
      // Apply custom cell styling before drawing
      if (data.section === 'body' && data.row.index < styles.length && data.column.index < styles[data.row.index].length) {
        const style = styles[data.row.index][data.column.index];
        if (style.fillColor) {
          // Type assertion might be needed if TS still complains, but let's try without first
          data.cell.styles.fillColor = style.fillColor; 
        }
      }
    }
  });
  
  // Add footer with information
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'AI Timetable Generator | Automated Scheduling',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(filename);
};

// Helper function to convert HSL color to RGB for PDF
function convertHSLtoRGB(hslColor: string): [number, number, number] {
  // Parse HSL values
  const hslMatch = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!hslMatch) return [240, 240, 240]; // Default light gray if parsing fails
  
  const h = parseInt(hslMatch[1]) / 360;
  const s = parseInt(hslMatch[2]) / 100;
  const l = parseInt(hslMatch[3]) / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // Achromatic (gray)
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  // Convert to 0-255 range
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Helper function to convert a subject list to PDF
export const downloadSubjectsAsPDF = (
  subjects: {
    id: string;
    name: string;
    teacher: string;
    weeklyHours: number;
    color?: string;
  }[],
  filename: string = 'subjects.pdf',
  title: string = 'Subject List'
) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add creation date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare headers
  const headers = ['Subject', 'Teacher', 'Weekly Hours'];
  
  // Prepare data
  const body = subjects.map(subject => [
    subject.name,
    subject.teacher,
    subject.weeklyHours.toString()
  ]);
  
  // Create the table
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Blue header
      textColor: 255,
      fontStyle: 'bold',
    },
  });
  
  // Add footer with information
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'AI Timetable Generator | Automated Scheduling',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(filename);
}; 