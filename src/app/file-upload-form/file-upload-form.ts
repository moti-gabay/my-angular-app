import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="p-4  rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">העלאת קובץ חדש</h2>

      <div class="mb-4">
        <label for="fileInput" class="block text-gray-700 text-sm font-bold mb-2">בחר קובץ:</label>
        <input type="file" id="fileInput" (change)="onFileSelected($event)"
               class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"/>
      </div>

      <div class="mb-4">
        <label for="categoryInput" class="block text-gray-700 text-sm font-bold mb-2">קטגוריה:</label>
        <input type="text" id="categoryInput" [(ngModel)]="fileCategory"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="לדוגמה: דוחות, תמונות">
      </div>

      <div class="mb-6">
        <label for="yearInput" class="block text-gray-700 text-sm font-bold mb-2">שנה:</label>
        <input type="number" id="yearInput" [(ngModel)]="fileYear"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="לדוגמה: 2024">
      </div>

      <button class="w-full bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              (click)="upload()">
        העלה קובץ
      </button>
    </div>
  `
})
export class FileUploadFormComponent {
  selectedFile?: File;
  fileCategory: string = '';
  fileYear: number | undefined;

  @Output() uploadSuccess = new EventEmitter<void>(); // EventEmitter ליידוע ההורה על העלאה מוצלחת

  constructor(private http: HttpClient) { }

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
        this.uploadSuccess.emit(); // שליחת אירוע להורה
        this.resetForm();
      },
      error: (err) => {
        console.error('שגיאה בהעלאת הקובץ:', err);
      }
    });
  }

  private resetForm() {
    this.selectedFile = undefined;
    this.fileCategory = '';
    this.fileYear = undefined;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
