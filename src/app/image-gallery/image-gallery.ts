// src/app/image-gallery/image-gallery.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService, ImageRecord } from '../services/image';
import { AuthService } from '../services/auth'; // ייבוא AuthService
import { map } from 'rxjs/operators'; // ייבוא map

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4 p-4 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto font-inter">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">גלריית תמונות שהועלו</h2>


      <div *ngIf="loading" class="text-center text-gray-600">טוען תמונות...</div>
      <div *ngIf="error" class="text-center text-red-500">{{ error }}</div>

      <div *ngIf="images.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div *ngFor="let img of images" class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <img [src]="getFullImageUrl(img.url)" [alt]="img.filename" class="w-full h-32 object-cover">
          <div class="p-2 text-center text-sm truncate">
            {{ img.filename }}
            <br>
            <span class="text-gray-500 text-xs">{{ img.uploaded_at | date:'short' }}</span>
          </div>
          <div class="p-2 text-center">
            <!-- כפתור המחיקה יוצג רק אם isAdmin הוא TRUE -->
            <button *ngIf="isAdmin" (click)="deleteImage(img.id)" class="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded-full">מחק</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && images.length === 0" class="text-center text-gray-500 p-4">
        עדיין לא הועלו תמונות.
      </div>
    </div>
  `
})
export class ImageGalleryComponent implements OnInit {
  images: ImageRecord[] = [];
  loading: boolean = true;
  error: string = '';
  isAdmin: boolean = false; // מאפיין לשליטה בתצוגת כפתור המחיקה

  constructor(
    private imageService: ImageService,
    private authService: AuthService // הזרקת AuthService
  ) { }

  ngOnInit(): void {
    this.fetchImages();

    // הרשמה למצב המשתמש הנוכחי כדי לקבוע אם המשתמש הוא אדמין
    this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin' || user?.role === "member") // המר את המשתמש לערך בוליאני true אם הוא אדמין
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin; // עדכן את המאפיין isAdmin
    });
  }

  fetchImages(): void {
    this.loading = true;
    this.error = '';
    this.imageService.getUploadedImages().subscribe({
      next: (data) => {
        this.images = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת התמונות.';
        this.loading = false;
        console.error('Error fetching images:', err);
      }
    });
  }

  // פונקציית עזר לבניית URL מלא לתמונה
  getFullImageUrl(relativePath: string): string {
    return `http://localhost:5000${relativePath}`;
  }

  /**
   * מוחק רשומת תמונה וגם את הקובץ הפיזי מהשרת.
   * פעולה זו מוגנת בצד השרת (admin_required).
   */
  deleteImage(imageId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק תמונה זו? פעולה זו בלתי הפיכה!')) {
      this.imageService.deleteImageRecord(imageId).subscribe({
        next: () => {
          console.log(`Image ${imageId} deleted successfully.`);
          this.fetchImages(); // רענן את הגלריה כדי להסיר את התמונה שנמחקה
        },
        error: (err) => {
          this.error = err.error?.message || 'שגיאה במחיקת התמונה.';
          console.error('Error deleting image:', err);
          if (err.status === 403) {
            alert('אין לך הרשאה למחוק תמונה זו. רק למנהלים מותר.');
          } else if (err.status === 404) {
            alert('התמונה לא נמצאה בשרת.');
          }
        }
      });
    }
  }
}
