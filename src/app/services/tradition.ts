// src/app/services/tradition.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from './url'; // וודא שהנתיב ל-API_URL נכון

// ממשק עבור פריט מסורת (TraditionItem)
export interface TraditionItem {
  id?: number; // אופציונלי ליצירה
  title: string;
  short_description?: string;
  full_content: string;
  category?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TraditionService {
  private apiUrl = API_URL + '/tradition'; // נקודת הקצה של השרת עבור מסורת

  constructor(private http: HttpClient) { }

  /**
   * מקבל את כל פריטי המסורת היהודית.
   */
  getAllTraditionItems(): Observable<TraditionItem[]> {
    return this.http.get<TraditionItem[]>(this.apiUrl, { withCredentials: true }).pipe(
      tap(data => console.log('Fetched tradition items:', data)),
      catchError(this.handleError)
    );
  }

  /**
   * מקבל פריט מסורת בודד לפי ID.
   */
  getTraditionItemById(id: number): Observable<TraditionItem> {
    return this.http.get<TraditionItem>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      tap(data => console.log(`Fetched tradition item ${id}:`, data)),
      catchError(this.handleError)
    );
  }

  /**
   * יוצר פריט מסורת חדש (דורש הרשאת אדמין).
   */
  createTraditionItem(item: TraditionItem): Observable<TraditionItem> {
    return this.http.post<TraditionItem>(this.apiUrl, item, { withCredentials: true }).pipe(
      tap(data => console.log('Created tradition item:', data)),
      catchError(this.handleError)
    );
  }

  /**
   * מעדכן פריט מסורת קיים (דורש הרשאת אדמין).
   */
  updateTraditionItem(id: number, item: TraditionItem): Observable<TraditionItem> {
    return this.http.put<TraditionItem>(`${this.apiUrl}/${id}`, item, { withCredentials: true }).pipe(
      tap(data => console.log(`Updated tradition item ${id}:`, data)),
      catchError(this.handleError)
    );
  }

  /**
   * מוחק פריט מסורת (דורש הרשאת אדמין).
   */
  deleteTraditionItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      tap(() => console.log(`Deleted tradition item ${id}`)),
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
    console.error('TraditionService: HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
