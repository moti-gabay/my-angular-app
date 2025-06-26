import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ייבוא FormsModule עבור ngModel

@Component({
  selector: 'app-fileupload',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // הוספת FormsModule
  template: `
    <div class="container mt-4 p-4 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto font-inter">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">העלאת קובץ</h2>

      <div class="mb-4">
        <label for="fileInput" class="block text-gray-700 text-sm font-bold mb-2">בחר קובץ:</label>
        <input type="file" id="fileInput" (change)="onFileSelected($event)"
               class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"/>
      </div>

      <div class="mb-4">
        <label for="categoryInput" class="block text-gray-700 text-sm font-bold mb-2">קטגוריה (העלאה):</label>
        <input type="text" id="categoryInput" [(ngModel)]="fileCategory"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="לדוגמה: דוחות, תמונות">
      </div>

      <div class="mb-6">
        <label for="yearInput" class="block text-gray-700 text-sm font-bold mb-2">שנה (העלאה):</label>
        <input type="number" id="yearInput" [(ngModel)]="fileYear"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="לדוגמה: 2024">
      </div>

      <button class="w-full bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              (click)="upload()">
        העלה קובץ
      </button>

      <hr class="my-8 border-gray-300">

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
        <!-- כפתורי הסינון יפעילו רענון תצוגה בלבד כעת -->
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
        <!-- ה-*ngFor לוקח עכשיו את הרשימה המסוננת והממוינת מה-getter -->
        <li *ngFor="let file of getFilteredAndSortedFiles()"
            class="list-group-item  p-4 mb-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200">
          
          <div class="flex flex-col flex-grow truncate mr-4">
            <a class="text-blue-600 hover:text-blue-800 text-lg font-medium truncate"
               [href]="'http://localhost:5000/files/' + file.filename" target="_blank">
              <span>{{ file.filename }}</span>
            </a>
            <div class="flex flex-wrap text-sm text-gray-600 mt-1">
              <span *ngIf="file.category" class="mr-2">קטגוריה: {{ file.category }}</span>
              <span *ngIf="file.year" class="mr-2">שנה: {{ file.year }}</span>
              <span *ngIf="file.upload_date" class="ml-2 font-bold"> תאריך העלאה: {{ file.upload_date | date:'yyyy-MM-dd' }}</span>
            </div>
          </div>
          
          <div class="flex-shrink-0 flex space-x-2">
            <a class="btn bg-green-500 hover:bg-green-600  font-bold py-1 px-3 rounded-full text-xs transition duration-300 ease-in-out"
               [href]="'http://localhost:5000/files/' + file.filename" target="_blank">צפה</a>
            <button class="btn bg-red-500 hover:bg-red-600  font-bold py-1 px-3 rounded-full text-xs transition duration-300 ease-in-out"
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
export class FileUploadComponent implements OnInit {
  selectedFile?: File;
  allFiles: any[] = []; // מערך שיחזיק את כל הקבצים שנטענו מהשרת
  
  fileCategory: string = ''; // קטגוריה להעלאה
  fileYear: number | undefined; // שנה להעלאה

  filterCategory: string = ''; // קטגוריה לסינון
  filterYear: number | undefined; // שנה לסינון

  sortColumn: string = 'upload_date'; // עמודה למיון ברירת מחדל
  sortDirection: 'asc' | 'desc' = 'desc'; // כיוון מיון ברירת מחדל

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // טוען את כל הקבצים בטעינה הראשונה של הקומפוננטה
    this.fetchFiles();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) {
      console.warn('לא נבחר קובץ להעלאה.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    if (this.fileCategory) {
      formData.append('category', this.fileCategory);
    }
    if (this.fileYear !== undefined) {
      formData.append('year', this.fileYear.toString());
    }

    this.http.post('http://localhost:5000/upload', formData, { withCredentials: true }).subscribe({
      next: () => {
        console.log('הקובץ הועלה בהצלחה!');
        this.fetchFiles(); // טען מחדש את כל הקבצים כדי לכלול את החדש
        this.selectedFile = undefined;
        this.fileCategory = '';
        this.fileYear = undefined;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (err) => {
        console.error('שגיאה בהעלאת הקובץ:', err);
      }
    });
  }

  /**
   * טוען את כל רשימת הקבצים מהשרת.
   * המיון והסינון יבוצעו בצד הלקוח.
   */
  fetchFiles() {
    const url = 'http://localhost:5000/files'; // פונה ל-endpoint שמחזיר את כל הקבצים

    this.http.get<any[]>(url, { withCredentials: true }).subscribe({
      next: (res) => {
        // המר את תאריכי ההעלאה לאובייקטי Date עבור מיון קל
        this.allFiles = res.map(file => ({
            ...file,
            upload_date: file.upload_date ? new Date(file.upload_date) : null
        }));
        console.log('כל רשימת הקבצים נטענה בהצלחה:', this.allFiles);
      },
      error: (err) => {
        console.error('שגיאה בטעינת רשימת הקבצים:', err);
        this.allFiles = []; // נקה את הרשימה במקרה של שגיאה
      }
    });
  }

  /**
   * פונקציה גוזלת המבצעת סינון ומיון של הקבצים בצד הלקוח.
   * Angular יפעיל אותה אוטומטית כאשר המאפיינים `filterCategory`, `filterYear`,
   * `sortColumn`, או `sortDirection` משתנים.
   */
  getFilteredAndSortedFiles(): any[] {
    let filteredFiles = [...this.allFiles]; // צור עותק כדי לא לשנות את המערך המקורי

    // 1. יישום סינון
    if (this.filterCategory) {
      filteredFiles = filteredFiles.filter(file => 
        file.category && file.category.toLowerCase().includes(this.filterCategory.toLowerCase())
      );
    }
    if (this.filterYear !== undefined && this.filterYear !== null) { // לוודא שלא undefined/null
      filteredFiles = filteredFiles.filter(file => 
        file.year && file.year === this.filterYear
      );
    }

    // 2. יישום מיון
    if (this.sortColumn) {
      filteredFiles.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        // טיפול בערכים שאינם מוגדרים
        if (valA === undefined || valA === null) valA = ''; // עבור מחרוזות/תאריכים ריקים
        if (valB === undefined || valB === null) valB = '';

        // המרה לטיפוסים נכונים לצורך השוואה
        if (this.sortColumn === 'upload_date') {
          valA = valA ? valA.getTime() : 0; // השוואה לפי timestamp של תאריך
          valB = valB ? valB.getTime() : 0;
        } else if (this.sortColumn === 'year') {
          valA = valA || 0; // שנה ריקה תהיה 0
          valB = valB || 0;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          // השוואה לא תלוית רישיות עבור מחרוזות
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

  /**
   * מפעיל את הסינון על בסיס הערכים בשדות הקלט filterCategory ו-filterYear.
   * כעת רק מפעיל רענון של התצוגה (ה-getter ירוץ מחדש).
   */
  applyFilters() {
    // Angular מזהה שינויים ב-filterCategory וב-filterYear ומפעיל את ה-getter מחדש.
    // אין צורך לקרוא ל-fetchFiles() אלא אם רוצים לרענן את כל הנתונים מהשרת.
    // console.log('Applying filters...');
  }

  /**
   * מנקה את שדות הסינון ומרענן את התצוגה.
   */
  clearFilters() {
    this.filterCategory = '';
    this.filterYear = undefined;
    // Angular יזהה שינויים ויפעיל את ה-getter מחדש.
    // console.log('Clearing filters...');
  }

  /**
   * מפעיל את המיון על בסיס הערכים בשדות הקלט sortColumn ו-sortDirection.
   * כעת רק מפעיל רענון של התצוגה.
   */
  applySort() {
    // Angular מזהה שינויים ב-sortColumn וב-sortDirection ומפעיל את ה-getter מחדש.
    // console.log('Applying sort...');
  }

  deleteFile(fileId: number) {
    const wantsToDelete = true; // יש להחליף בתיבת דיאלוג מותאמת אישית
    if (!wantsToDelete) {
      console.log('מחיקת הקובץ בוטלה על ידי המשתמש.');
      return;
    }

    this.http.delete(`http://localhost:5000/files/${fileId}`, { withCredentials: true }).subscribe({
      next: () => {
        console.log('הקובץ נמחק בהצלחה!');
        this.fetchFiles(); // טען מחדש את כל הקבצים כדי שהרשימה תתעדכן
      },
      error: (err) => {
        console.error('שגיאה במחיקת הקובץ:', err);
      }
    });
  }
}
