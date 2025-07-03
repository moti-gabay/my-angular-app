import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService, ImageRecord } from '../services/image';
import { AuthService } from '../services/auth';
import { map } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { API_URL } from '../services/url';
import { ImageUploaderComponent } from '../image-uploader/image-uploader';

@Component({
  selector: 'app-image-gallery',
  imports: [CommonModule,ImageUploaderComponent],
  templateUrl: './image-gallery.html',
  styleUrls: ['./image-gallery.css']
})
export class ImageGalleryComponent implements OnInit {
  images: ImageRecord[] = [];
  loading: boolean = true;
  error: string = '';
  isAdmin: boolean = false;

  constructor(
    private imageService: ImageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.fetchImages();

    this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin' || user?.role === "member")
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  fetchImages(): void {
    this.loading = true;
    this.error = '';
    this.imageService.getUploadedImages().subscribe({
      next: (data) => {
        this.images = data;
        this.preloadImages(); // קריאה לטעינה מוקדמת
        this.loading = false;
        this.cdr.detectChanges(); // לגרום לאנגולר לעדכן מיידית

      },
      error: (err) => {
        this.error = 'שגיאה בטעינת התמונות.';
        this.loading = false;
        console.error('Error fetching images:', err);
        this.cdr.detectChanges(); // לגרום לאנגולר לעדכן מיידית

      }
    });
  }

  // בניית URL מלא
  getFullImageUrl(relativePath: string): string {
    return `${API_URL}${relativePath}`;
  }

  // טעינה מוקדמת (חשוב)
  preloadImages(): void {
    this.images.forEach(img => {
      const preloadImage = new Image();
      preloadImage.src = this.getFullImageUrl(img.url);
    });
  }

  deleteImage(imageId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק תמונה זו? פעולה זו בלתי הפיכה!')) {
      this.imageService.deleteImageRecord(imageId).subscribe({
        next: () => {
          console.log(`Image ${imageId} deleted successfully.`);
          this.fetchImages();
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
