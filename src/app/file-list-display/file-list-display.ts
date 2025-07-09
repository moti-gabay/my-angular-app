import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { map } from 'rxjs/operators';
import { API_URL } from '../services/url';
import { ChangeDetectorRef } from "@angular/core"

@Component({
  selector: 'app-file-list-display',
  imports: [CommonModule, FormsModule],
  templateUrl: "./file-list-display.html",
  styleUrl: "./file-list-display.css"
})
export class FileListDisplayComponent implements OnInit, OnChanges {
  @Input() allFiles: any[] = [];
  @Output() fileDeleted = new EventEmitter<number>();

  displayedFiles: any[] = [];

  filterCategory: string = '';
  filterYear: number | undefined;
  sortColumn: string = 'upload_date';
  sortDirection: 'asc' | 'desc' = 'desc';
  isAdmin: boolean = false;
  userMap = new Map<number, string>();

  constructor(private http: HttpClient, private authService: AuthService,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin')
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.authService.getAllUsers().subscribe({
      next: (users: any) => { // אם ה-API שלך מחזיר מערך
        users.forEach((user: any) => {
          this.userMap.set(user.id, user.full_name); // יצירת מפה של id לשם
        });
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('שגיאה בטעינת רשימת המשתמשים:', err);
      }
    });
  }
  getUserNameById(userId: number): string {
    return this.userMap.get(userId) || 'משתמש לא ידוע';
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allFiles']) {
      this.updateDisplayedFiles();
    }
  }

  updateDisplayedFiles() {
    this.displayedFiles = this.getFilteredAndSortedFiles();
  }

  applyFilters() {
    this.updateDisplayedFiles();
  }

  clearFilters() {
    this.filterCategory = '';
    this.filterYear = undefined;
    this.updateDisplayedFiles();
  }

  applySort() {
    this.updateDisplayedFiles();
  }

  deleteFile(fileId: number) {
    if (!confirm("אתה בטוח שאתה רוצה למחוק את הקובץ?")) {
      console.log('מחיקת הקובץ בוטלה על ידי המשתמש.');
      return;
    }

    this.http.delete(`${API_URL}/files/${fileId}`, { withCredentials: true }).subscribe({
      next: () => {
        alert('הקובץ נמחק בהצלחה!');
        this.allFiles = this.allFiles.filter(file => file.id !== fileId); // מעדכן את הרשימה המקומית
        this.updateDisplayedFiles(); // מרענן את הרשימה המוצגת
        this.fileDeleted.emit(fileId); // אם ההורה צריך לדעת
      },
      error: (err) => {
        console.error('שגיאה במחיקת הקובץ:', err);
      }
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
          valA = valA ? new Date(valA).getTime() : 0; // תוקן: ודא שמדובר ב-Date
          valB = valB ? new Date(valB).getTime() : 0;
        } else if (this.sortColumn === 'year') {
          valA = valA || 0;
          valB = valB || 0;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        let comparison = 0;
        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;

        return this.sortDirection === 'desc' ? comparison * -1 : comparison;
      });
    }

    return filteredFiles;
  }
}
