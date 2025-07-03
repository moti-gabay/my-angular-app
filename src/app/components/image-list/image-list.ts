import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_URL } from '../../services/url';
import { ChangeDetectorRef } from '@angular/core';

interface ImageData {
  id: number;
  filename: string;
  uploaded_at: string;
  uploaded_by: number;
  url: string; // ודא שתמיד מגיע מהשרת
}

@Component({
  selector: 'app-image-list',
  // standalone: true,
  imports: [CommonModule],
  templateUrl: './image-list.html',
  styleUrls: ['./image-list.css']
})
export class ImageListComponent implements OnInit {

  images: ImageData[] = [];
  currentIndex = 0;
  loading = true;
  error = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.http.get<ImageData[]>(`${API_URL}/images`)
      .subscribe({
        next: (data) => {
          this.images = data;
          this.loading = false;
          if (this.images.length > 0) {
            this.startAutoSlide();  // תתחיל אוטומציה רק אחרי שיש תמונות
          }
          // גרום לאנגולר לבדוק שוב את השינויים אחרי טעינה
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading images', err)
      });
  }


  startAutoSlide() {
    setInterval(() => {
      if (this.images.length > 0) {
        this.nextImage();
      }
    }, 3000);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  getFullImageUrl(relativeUrl: string): string {
    return `${API_URL}${relativeUrl}`;
  }
}
