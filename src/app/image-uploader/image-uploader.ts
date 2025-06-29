// src/app/image-uploader/image-uploader.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">העלאת תמונה</h3>
      <input type="file" (change)="onFileSelected($event)" accept="image/*"
             class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
      <button class="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full text-sm"
              (click)="uploadImage()">
        העלה תמונה
      </button>

      <div *ngIf="uploading" class="text-sm text-gray-600 mt-2">מעלה תמונה...</div>
      <div *ngIf="uploadError" class="text-sm text-red-500 mt-2">{{ uploadError }}</div>
      <div *ngIf="uploadedImageUrl" class="text-sm text-green-600 mt-2">
        התמונה הועלתה בהצלחה: <a [href]="uploadedImageUrl" target="_blank" class="text-blue-500 hover:underline">{{ uploadedImageUrl }}</a>
      </div>
    </div>
  `
})
export class ImageUploaderComponent {
  selectedFile?: File;
  uploading: boolean = false;
  uploadError: string = '';
  uploadedImageUrl: string = '';

  @Output() imageUploaded = new EventEmitter<{ url: string, id: number, filename: string }>(); // פולט את URL התמונה המועלה

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadedImageUrl = '';
    this.uploadError = '';
  }

  uploadImage() {
    if (!this.selectedFile) {
      this.uploadError = 'אנא בחר קובץ תמונה להעלאה.';
      return;
    }

    this.uploading = true;
    this.uploadError = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post<any>('http://localhost:5000/images', formData, { withCredentials: true }).subscribe({
      next: (res) => {
        this.uploading = false;
        this.uploadedImageUrl = `http://localhost:5000${res.url}`; 
        this.imageUploaded.emit({ url: this.uploadedImageUrl, id: res.id, filename: res.filename }); 
        console.log('Image uploaded successfully:', res);
        this.selectedFile = undefined;
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = err.error?.message || 'שגיאה בהעלאת התמונה.';
        console.error('Image upload error:', err);
      }
    });
  }
}
