// src/app/services/news.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from './url'; // וודא שהנתיב ל-API_URL נכון

export interface NewsItem {
  id?: number; // אופציונלי ליצירה/עדכון
  title: string;
  description: string; // תיאור קצר / תקציר
  full_content: string; // תוכן הכתבה המלא
  imageUrl: string; // URL לתמונה (כפי שמגיע מהשרת)
  published_at?: string; // תאריך/שעת פרסום (עדיין קיים)
  timeAgo?: string; // מחרוזת "לפני X זמן" (כפי שמגיע מהשרת)
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = API_URL + '/news'; // הנחתי ש-API_URL הוא 'http://localhost:5000/api'

  constructor(private http: HttpClient) { }

  getNews(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(this.apiUrl, { withCredentials: true }).pipe(
      tap(data => console.log('Fetched news items:', data)),
      catchError(this.handleError)
    );
  }

  getNewsItemById(id: number): Observable<NewsItem> {
    return this.http.get<NewsItem>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      tap(data => console.log(`Fetched news item ${id}:`, data)),
      catchError(this.handleError)
    );
  }

  // פונקציה חדשה: יצירת פריט חדשות
  createNewsItem(item: NewsItem): Observable<NewsItem> {
    return this.http.post<NewsItem>(this.apiUrl, item, { withCredentials: true }).pipe(
      tap(data => console.log('Created news item:', data)),
      catchError(this.handleError)
    );
  }

  // פונקציה חדשה: עדכון פריט חדשות קיים
  updateNewsItem(id: number, item: NewsItem): Observable<NewsItem> {
    return this.http.put<NewsItem>(`${this.apiUrl}/${id}`, item, { withCredentials: true }).pipe(
      tap(data => console.log(`Updated news item ${id}:`, data)),
      catchError(this.handleError)
    );
  }

  // פונקציה חדשה: מחיקת פריט חדשות
  deleteNewsItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      tap(() => console.log(`Deleted news item ${id}`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status}\nMessage: ${error.error?.message || error.statusText}`;
    }
    console.error('NewsService: HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
