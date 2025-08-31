// src/app/news-article/news-article.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService, NewsItem } from '../../services/news'; // וודא נתיב נכון
import { CommonModule, DatePipe } from '@angular/common'; // ייבוא CommonModule ו-DatePipe
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // לייבוא DomSanitizer
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { map } from 'rxjs';
import { API_URL } from '../../services/url';

@Component({
  selector: 'app-news-info',
  // standalone: true,
  imports: [CommonModule, DatePipe, RouterLink], // הוספת DatePipe
  templateUrl: './news-info.html',
  styleUrls: ['./news-info.css']
})
export class NewsInfo implements OnInit {
  newsItem: NewsItem | null = null;
  loading: boolean = true;
  error: string = '';
  safeFullContent: SafeHtml | null = null; // לתוכן HTML בטוח
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private newsService: NewsService,
    private sanitizer: DomSanitizer, // הזרקת DomSanitizerת
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.error = '';
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.newsService.getNewsItemById(id).subscribe({
          next: (data) => {
            this.newsItem = data;
            // אם full_content מכיל HTML, סמן אותו כבטוח
            if (this.newsItem && this.newsItem.full_content) {
              this.safeFullContent = this.sanitizer.bypassSecurityTrustHtml(this.newsItem.full_content);
            }
            this.loading = false;
            this.cdr.detectChanges()
          },
          error: (err) => {
            console.error('Error fetching news article:', err);
            this.error = 'שגיאה בטעינת הכתבה.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'מזהה כתבה לא נמצא.';
        this.loading = false;
      }
    });
  }

   getFullImageUrl(relativeUrl: string | undefined): string {
      // console.log(`${relativeUrl}`)
      if (!relativeUrl) {
        return 'https://placehold.co/400x200/cccccc/333333?text=אין+תמונה'; // תמונת פלייס הולדר
      }
      const baseUrl = API_URL; // וודא שזה תואם ל-base URL של השרת שלך
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl; // אם זה כבר URL מלא
      }
      return `${baseUrl}${relativeUrl}`;
    }
}
