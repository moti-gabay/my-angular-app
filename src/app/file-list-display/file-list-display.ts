import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common'; // הוספת DatePipe
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-file-list-display',
  // standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./file-list-display.html",
  styleUrl: "./file-list-display.css"
})
export class FileListDisplayComponent {
  @Input() allFiles: any[] = []; // קבלת כל הקבצים מקומפוננטת ההורה
  @Output() fileDeleted = new EventEmitter<number>(); // ליידוע ההורה על מחיקה
  @Output() refreshFiles = new EventEmitter<void>(); // ליידוע ההורה לרענן את רשימת הקבצים המלאה

  filterCategory: string = '';
  filterYear: number | undefined
  sortColumn: string = 'upload_date';
  sortDirection: 'asc' | 'desc' = 'desc';
  isAdmin: boolean = false; // מאפיין חדש לשמירת מצב האדמין

  constructor(private http: HttpClient, private authService: AuthService) { } // הזרקת AuthService

  ngOnInit(): void {
    // הרשמה לשינויים בתפקיד המשתמש כדי לעדכן את isAdmin
    this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin') // מיפוי לתפקיד 'admin'
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
  getFilteredAndSortedFiles(): any[] {
    let filteredFiles = [...this.allFiles];

    if (this.filterCategory) {
      filteredFiles = filteredFiles.filter(file =>
        file.category && file.category.toLowerCase().includes(this.filterCategory.toLowerCase())
      );
    }
    if (this.filterYear !== undefined && this.filterYear !== null) {
      filteredFiles = filteredFiles.filter(file =>
        file.year && file.year === this.filterYear
      );
    }

    if (this.sortColumn) {
      filteredFiles.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        if (this.sortColumn === 'upload_date') {
          valA = valA ? valA.getTime() : 0;
          valB = valB ? valB.getTime() : 0;
        } else if (this.sortColumn === 'year') {
          valA = valA || 0;
          valB = valB || 0;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        let comparison = 0;
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }

        return this.sortDirection === 'desc' ? comparison * -1 : comparison;
      });
    }

    return filteredFiles;
  }

  applyFilters() {
    // No explicit action needed here, the getter reacts to ngModel changes
  }

  clearFilters() {
    this.filterCategory = '';
    this.filterYear = undefined;
  }

  applySort() {
    // No explicit action needed here, the getter reacts to ngModel changes
  }

  deleteFile(fileId: number) {
    const wantsToDelete = true; // Replace with a custom dialog
    if (!wantsToDelete) {
      console.log('מחיקת הקובץ בוטלה על ידי המשתמש.');
      return;
    }

    this.http.delete(`http://localhost:5000/files/${fileId}`, { withCredentials: true }).subscribe({
      next: () => {
        console.log('הקובץ נמחק בהצלחה!');
        this.fileDeleted.emit(fileId); // יידוע ההורה על מחיקה
        // אין צורך ב-this.refreshFiles.emit() אם ההורה מקבל את ה-fileDeleted ומרענן בעצמו
      },
      error: (err) => {
        console.error('שגיאה במחיקת הקובץ:', err);
      }
    });
  }
}
