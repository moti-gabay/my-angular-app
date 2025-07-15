// src/app/news-list/news-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService, NewsItem } from '../../services/news'; // ייבוא NewsService ו-NewsItem
import { RouterLink } from '@angular/router'; // לייבוא RouterLink לקישורים
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { map } from 'rxjs';
import { API_URL } from '../../services/url';

@Component({
  selector: 'app-news', // שינוי הסלקטור לשם עקבי
  // standalone: true, // וודא שזה standalone
  imports: [CommonModule, RouterLink], // הוספת RouterLink
  templateUrl: './news.html', // וודא ששם הקובץ נכון
  styleUrls: ['./news.css'] // וודא ששם הקובץ נכון
})
export class News implements OnInit { // שינוי שם הקלאס ל-NewsListComponent
  news: NewsItem[] = [];
  loading: boolean = false; // מצב טעינה
  error: string = ''; // הודעת שגיאה
  isAdmin: boolean = false;

  constructor(private newsService: NewsService, private cdr: ChangeDetectorRef, private authService: AuthService) { } // הזרקת NewsService

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin')
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.fetchNews(); // קריאה לפונקציה לשליפת חדשות עם אתחול הקומפוננטה

  }

  fetchNews(): void {
    this.loading = false; // התחל טעינה
    this.error = ''; // נקה שגיאות קודמות

    this.newsService.getNews().subscribe({
      next: (data) => {
        this.news = data; // עדכן את מערך החדשות עם הנתונים שהתקבלו

        this.loading = false; // סיים טעינה
        this.cdr.detectChanges()
        // console.log('חדשות נטענו בהצלחה:', this.news);
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת החדשות. אנא נסה שוב מאוחר יותר.'; // הגדר הודעת שגיאה
        this.loading = false; // סיים טעינה במקרה של שגיאה
        console.error('שגיאה בשליפת חדשות:', err);
      }
    });
  }

  deleteNewsItem(id: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק כתבה זו?')) {
      this.newsService.deleteNewsItem(id).subscribe({
        next: () => {
          alert('הכתבה נמחקה בהצלחה.');
          this.fetchNews(); // רענן את רשימת החדשות לאחר המחיקה
        },
        error: (err) => {
          console.error('שגיאה במחיקת כתבה:', err);
          alert('שגיאה במחיקת הכתבה.');
        }
      });
    }
  }

  getFullImageUrl(relativeUrl: string | undefined): string {
    if (!relativeUrl) {
      return 'https://placehold.co/400x200/cccccc/333333?text=אין+תמונה'; // תמונת פלייס הולדר
    }
    const baseUrl = 'http://localhost:5000'; // וודא שזה תואם ל-base URL של השרת שלך
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl; // אם זה כבר URL מלא
    }
    return `${baseUrl}${relativeUrl}`;
  }
}
