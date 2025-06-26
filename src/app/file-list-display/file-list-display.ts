import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common'; // הוספת DatePipe
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-file-list-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="p-4  rounded-lg shadow-md">
      <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">סינון ומיון קבצים</h3>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-grow">
          <label for="filterCategoryInput" class="block text-gray-700 text-sm font-bold mb-2">סנן לפי קטגוריה:</label>
          <input type="text" id="filterCategoryInput" [(ngModel)]="filterCategory"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 placeholder="כל הקטגוריות">
        </div>
        <div class="flex-grow">
          <label for="filterYearInput" class="block text-gray-700 text-sm font-bold mb-2">סנן לפי שנה:</label>
          <input type="number" id="filterYearInput" [(ngModel)]="filterYear"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 placeholder="כל השנים">
        </div>
        <button class="mt-auto bg-purple-500 hover:bg-purple-700  font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out sm:w-auto w-full"
                (click)="applyFilters()">
          סנן
        </button>
        <button class="mt-auto bg-gray-500 hover:bg-gray-700  font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out sm:w-auto w-full"
                (click)="clearFilters()">
          נקה סינון
        </button>
      </div>

      <!-- אפשרויות מיון -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div class="flex-grow">
          <label for="sortColumn" class="block text-gray-700 text-sm font-bold mb-2">מיין לפי:</label>
          <select id="sortColumn" [(ngModel)]="sortColumn"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="upload_date">תאריך העלאה</option>
            <option value="filename">שם קובץ</option>
            <option value="category">קטגוריה</option>
            <option value="year">שנה</option>
          </select>
        </div>
        <div class="flex-grow">
          <label for="sortDirection" class="block text-gray-700 text-sm font-bold mb-2">כיוון מיון:</label>
          <select id="sortDirection" [(ngModel)]="sortDirection"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="asc">עולה (A-Z, 1-9)</option>
            <option value="desc">יורד (Z-A, 9-1)</option>
          </select>
        </div>
        <button class="mt-auto bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out sm:w-auto w-full"
                (click)="applySort()">
          מיין
        </button>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">רשימת קבצים</h3>
      <ul class="list-group">
        <li *ngFor="let file of getFilteredAndSortedFiles()"
            class="list-group-item  p-4 mb-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200">
          
          <div class="flex flex-col flex-grow truncate mr-4">
            <a class="text-blue-600 hover:text-blue-800 text-lg font-medium truncate"
               [href]="'http://localhost:5000/files/' + file.filename" target="_blank">
              <span>{{ file.filename }}</span>
            </a>
            <div class="flex flex-wrap text-sm text-gray-600 mt-1">
              <span *ngIf="file.category" class="mr-2">קטגוריה: {{ file.category }}</span> |
              <span *ngIf="file.year" class="mr-2">שנה: {{ file.year }}</span> |
              <span *ngIf="file.upload_date" class="ml-2 font-bold"> תאריך העלאה: {{ file.upload_date | date:'yyyy-MM-dd' }}</span>
            </div>
          </div>
          
          <div class="flex-shrink-0 flex space-x-2">
            <a class="btn bg-green-500 hover:bg-green-600 font-bold py-1 px-3 rounded-full text-xs transition duration-300 ease-in-out"
               [href]="'http://localhost:5000/files/' + file.filename" target="_blank">צפה</a>
           <button *ngIf="isAdmin"
                    class="btn bg-red-500 hover:bg-red-600  font-bold py-1 px-3 rounded-full text-xs transition duration-300 ease-in-out"
                    (click)="deleteFile(file.id)">מחק</button>
          </div>
        </li>
        <li *ngIf="getFilteredAndSortedFiles().length === 0" class="text-center text-gray-500 p-4">
          אין קבצים להצגה התואמים לסינון.
        </li>
      </ul>
    </div>
  `
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
