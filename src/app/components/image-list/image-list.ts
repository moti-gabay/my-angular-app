import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


interface ImageData {
  id: number;
  filename: string;
  uploaded_at: string;
  uploaded_by: number;
  url: string;
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

  constructor(private http: HttpClient) { }

 ngOnInit() {
    this.loadImages();
    this.autoSlide();
  }

    nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  autoSlide() {
    setInterval(() => {
      if (this.images.length > 0) {
        this.nextImage();
      }
    }, 3000); // כל 3 שניות
  }
  loadImages() {
    this.http.get<ImageData[]>('http://localhost:5000/images') // תחליף לכתובת השרת שלך
      .subscribe({
        next: (data) => {
          this.images = data 
          console.log('הצג תמונות', this.images)},
        error: (err) => console.error('שגיאה בטעינת תמונות', err)
      });
  }
  getFullImageUrl(relativeUrl: string): string {
  return `http://localhost:5000${relativeUrl}`; // תעדכן לכתובת השרת שלך
}

}
