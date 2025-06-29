// src/app/file-manager/file-manager.component.ts
// (לא שינוי מהקוד הקודם, רק לוודא ייבואים)
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FileUploadFormComponent } from '../file-upload-form/file-upload-form';
import { FileListDisplayComponent } from '../file-list-display/file-list-display';
import { ImageUploaderComponent } from '../image-uploader/image-uploader';
import { ImageGalleryComponent } from '../image-gallery/image-gallery';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadFormComponent,
    FileListDisplayComponent
  ],
  template: `
    <div class="container mt-4 p-4 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto font-inter">
      <app-file-upload-form (uploadSuccess)="onUploadSuccess()"></app-file-upload-form>
      <hr class="my-8 border-gray-300">
      <app-file-list-display 
        [allFiles]="allFiles" 
        (fileDeleted)="onFileDeleted($event)"
      ></app-file-list-display>
      <hr class="my-8 border-gray-300">
    </div>
  `
})
export class FileManagerComponent implements OnInit {
  allFiles: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchFiles();
  }

  fetchFiles() {
    const url = 'http://localhost:5000/files'; // פונה ל-endpoint שמחזיר את כל הקבצים

    this.http.get<any[]>(url, { withCredentials: true }).subscribe({
      next: (res) => {
        this.allFiles = res.map(file => ({
          ...file,
          upload_date: file.upload_date ? new Date(file.upload_date) : null
        }));
      },
      error: (err) => {
        console.error('שגיאה בטעינת רשימת הקבצים בקומפוננטת האב:', err);
        this.allFiles = [];
      }
    });
  }

  onUploadSuccess() {
    console.log('קובץ הועלה בהצלחה, מרענן את רשימת הקבצים.');
    this.fetchFiles();
  }

  onFileDeleted(fileId: number) {
    console.log(`קובץ עם ID ${fileId} נמחק, מרענן את רשימת הקבצים.`);
    this.fetchFiles();
  }
}