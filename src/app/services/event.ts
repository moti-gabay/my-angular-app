// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './url';

export interface EventRecord {
  id?: number; // אופציונלי ליצירה
  title: string;
  date?: string; // נשלח כמחרוזת ISO 8601, יכול להיות None
  time?: string; // חדש: זמן האירוע כמחרוזת (HH:MM:SS)
  location?: string;
  needed_volunteers?: number; // חדש: מספר מתנדבים נדרשים
  registered_users?: number[]; // ✅ מזהים של המשתמשים שנרשמו
  description?: string; // תיאור האירוע
  is_approved?: boolean; // חדש: האם האירוע מאושר
  created_by?: number;
  // created_at?: string; // שדות אלו הוסרו מהבקשה
  // updated_at?: string; // שדות אלו הוסרו מהבקשה
  // creator_email?: string; // שדות אלו הוסרו מהבקשה
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

  registerToEvent(eventId: number) {
    return this.http.post(`${this.apiUrl}/${eventId}/register`, {}, { withCredentials: true })
  }
  unregisterToEvent(eventId: number) {
    return this.http.post(`${this.apiUrl}/${eventId}/unregister`, {}, { withCredentials: true })
  }
}
