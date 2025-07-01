// src/app/image-gallery/image-gallery.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService, ImageRecord } from '../services/image';
import { AuthService } from '../services/auth'; // ייבוא AuthService
import { map } from 'rxjs/operators'; // ייבוא map

@Component({
  selector: 'app-image-gallery',
  // standalone: true,
  imports: [CommonModule],
  templateUrl:"./image-gallery.html",
  styleUrls:["./image-gallery.css"]
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
