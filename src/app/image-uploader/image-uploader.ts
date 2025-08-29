// src/app/image-uploader/image-uploader.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../services/url';
import { ChangeDetectorRef } from "@angular/core"
@Component({
  selector: 'app-image-uploader',
  // standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css'
})
export class ImageUploaderComponent {
  selectedFile?: File;
  uploading: boolean = false;
  uploadError: string = '';
  uploadedImageUrl: string = '';

  @Output() imageUploaded = new EventEmitter<{ url: string, id: number, filename: string }>(); // פולט את URL התמונה המועלה

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

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

    this.http.post<any>(`${API_URL}/images`, formData, { withCredentials: true }).subscribe({
      next: (res) => {
        this.uploading = false;
        this.uploadedImageUrl = `${API_URL}${res.url}`;
        this.imageUploaded.emit({ url: this.uploadedImageUrl, id: res._id, filename: res.filename });
        // console.log('Image uploaded successfully:', res);
        this.selectedFile = undefined;
        this.cdr.detectChanges()
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = err.error?.message || 'שגיאה בהעלאת התמונה.';
        console.error('Image upload error:', err);
      }
    });
  }
}
