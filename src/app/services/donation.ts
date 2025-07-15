// src/app/services/donation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:5000/api'; // בסיס ה-API

  constructor(private http: HttpClient) { }

  sendDonationConfirmationEmail(emailDetails: { recipient_email: string, payer_name: string, amount: number, currency: string, transaction_id: string }): Observable<any> {
    // console.log('DonationService: Sending donation confirmation email request...', emailDetails);
    return this.http.post<any>(`${this.apiUrl}/send-donation-confirmation`, emailDetails, { withCredentials: true }).pipe(
      tap(response => console.log('DonationService: Email sent response:', response)),
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
    console.error('DonationService: HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
