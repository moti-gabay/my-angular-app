// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5000/api'; // בסיס ה-API

  constructor(private http: HttpClient) { }

  sendContactForm(formData: ContactFormData): Observable<any> {
    // console.log('ContactService: Sending contact form data...', formData);
    return this.http.post<any>(`${this.apiUrl}/send-contact-email`, formData, { withCredentials: true }).pipe(
      tap(response => console.log('ContactService: Contact email sent response:', response)),
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
    console.error('ContactService: HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
