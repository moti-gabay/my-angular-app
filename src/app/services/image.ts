// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API, API_URL } from './url';

// הגדרת ממשק (interface) לתמונה, כפי שחוזר מהשרת
export interface ImageRecord {
  _id: number;
  filename: string;
  url: string; // זה הנתיב היחסי: /images/<filename>
  uploaded_at: string; // יגיע כמחרוזת ISO
  uploaded_by: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = API_URL + '/images'; // ה-Blueprint URL של ניהול תמונות

  constructor(private http: HttpClient) { }

  /**
   * מקבל רשימת כל רשומות התמונות מהשרת.
   */
  getUploadedImages(): Observable<ImageRecord[]> {
    return this.http.get<ImageRecord[]>(this.apiUrl, { withCredentials: true });
  }

  // ניתן להוסיף כאן גם מתודות למחיקה או עדכון רשומות תמונה אם תצטרך
  deleteImageRecord(imageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${imageId}`, { withCredentials: true });
  }
}