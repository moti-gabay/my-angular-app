// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from './url'; // וודא שהנתיב ל-API_URL נכון

// הגדרת ממשק EventRecord
export interface EventRecord {
  id?: number; // אופציונלי ליצירה
  title: string;
  date?: string; // נשלח כמחרוזת ISO 8601, יכול להיות None
  time?: string; // חדש: זמן האירוע כמחרוזת (HH:MM:SS)
  location?: string;
  needed_volunteers?: number; // חדש: מספר מתנדבים נדרשים
  registered_users?: number[]; // מזהים של המשתמשים שנרשמו
  description?: string; // תיאור האירוע
  is_approved?: boolean; // חדש: האם האירוע מאושר
  created_by?: number;
  creator_email?: string; // <--- נוסף: אימייל יוצר האירוע
  creator_name?: string; // <--- נוסף: שם יוצר האירוע
}

// ממשק לנתוני אימייל אישור אירוע
export interface ApprovedEventEmailData {
  recipient_email?: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  creator_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = API_URL + '/events';

  constructor(private http: HttpClient) { }

  /**
   * מקבל רשימת אירועים.
   * השרת יסנן אוטומטית לפי תפקיד המשתמש.
   */
  getEvents(): Observable<EventRecord[]> {
    return this.http.get<EventRecord[]>(this.apiUrl, { withCredentials: true });
  }

  /**
   * מקבל אירוע ספציפי לפי ID.
   * השרת יבצע בדיקת הרשאות (ציבורי/פרטי) לפי תפקיד.
   */
  getEventById(id: number): Observable<EventRecord> {
    return this.http.get<EventRecord>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  /**
   * יוצר אירוע חדש (מנהלים בלבד).
   */
  createEvent(event: EventRecord): Observable<EventRecord> {
    return this.http.post<EventRecord>(this.apiUrl, event, { withCredentials: true });
  }

  /**
   * מעדכן אירוע קיים (מנהלים בלבד).
   */
  updateEvent(id: number, event: EventRecord): Observable<EventRecord> {
    return this.http.put<EventRecord>(`${this.apiUrl}/${id}`, event, { withCredentials: true });
  }

  /**
   * מודifies event's status (Admins only).
   */
  approveEvent(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {}, { withCredentials: true });
  }

  /**
   * שולח אימייל ליוצר האירוע לאחר אישור האירוע.
   */
  sendMailToCreatorEvent(emailData: ApprovedEventEmailData): Observable<any> { // <--- תיקון: שינוי מ-fullEvent ל-ApprovedEventEmailData
    // וודא שהנתיב ל-endpoint של שליחת אימיילים נכון
    console.log("emailData from sendMailToCreatorEvent function ", emailData)
    return this.http.post(`${API_URL}/api/send-event-approved-email`, emailData, { withCredentials: true });
  }

  unapproveEvent(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/unapprove`, {}, { withCredentials: true });
  }

  getApprovedEvents(): Observable<EventRecord[]> {
    return this.http.get<EventRecord[]>(`${this.apiUrl}/approved`, { withCredentials: true });
  }

  /**
   * מוחק אירוע (מנהלים בלבד).
   */
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  registerToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/register`, {}, { withCredentials: true });
  }

  unregisterToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/unregister`, {}, { withCredentials: true });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status}\nMessage: ${error.error?.message || error.statusText}`;
    }
    console.error('EventService: HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
