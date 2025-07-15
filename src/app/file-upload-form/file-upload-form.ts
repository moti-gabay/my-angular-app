import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_URL } from '../services/url';

@Component({
  selector: 'app-file-upload-form',
  // standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:"./file-upload-form.html",
  styleUrl:"./file-upload-form.css"
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

    this.http.post(`${API_URL}/upload`, formData, { withCredentials: true }).subscribe({
      next: () => {
        // console.log('הקובץ הועלה בהצלחה!');
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
