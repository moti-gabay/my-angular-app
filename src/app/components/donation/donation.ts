// src/app/donation/donation.component.ts
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { environment } from '../../../env/env'; // Correct path to environment
import { DonationService } from '../../services/donation'; // Import DonationService
import { AuthService } from '../../services/auth'; // Import AuthService to get user email
import { take } from 'rxjs/operators';

// Declare the global paypal variable for TypeScript compiler
declare const paypal: any;

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.html', // Ensure correct template file name
  styleUrls: ['./donation.css'] // Ensure correct style file name
})
export class DonationComponent implements OnInit, AfterViewInit { // Changed class name to DonationComponent for consistency
  @ViewChild('paypalButtonContainer', { static: true }) paypalButtonContainer!: ElementRef;

  donationAmount: number = 10; // Default donation amount
  donationStatus: string = ''; // Status messages for the user
  currentUserEmail: string = ''; // To store the logged-in user's email

  constructor(
    private donationService: DonationService, // Inject DonationService
    private authService: AuthService // Inject AuthService
  ) { }

  ngOnInit(): void {
    // Load the PayPal SDK script dynamically
    this.loadPayPalScript();

    // Get the logged-in user's email
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && user.email) {
        this.currentUserEmail = user.email;
      }
    });
  }

  ngAfterViewInit(): void {
    // Try to render the button after the View is loaded, but wait for the script to load completely
    if (typeof paypal !== 'undefined') {
      this.renderPayPalButton();
    } else {
      // If the script hasn't loaded yet, wait for it
      const script = document.getElementById('paypal-sdk') as HTMLScriptElement;
      if (script) { // Ensure the script element exists
        script.onload = () => {
          this.renderPayPalButton();
        };
      }
    }
  }

  private loadPayPalScript(): void {
    if (document.getElementById('paypal-sdk')) {
      // console.log('PayPal SDK already loaded.');
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    // Use environment.paypalClientId
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=ILS&disable-funding=credit,card`; // ILS for Israeli Shekel
    script.onload = () => {
      // console.log('PayPal SDK loaded successfully.');
      // If the script loads after ngAfterViewInit, render the button here
      if (this.paypalButtonContainer && typeof paypal !== 'undefined') {
        this.renderPayPalButton();
      }
    };
    script.onerror = (error) => {
      console.error('Failed to load PayPal SDK:', error);
      this.donationStatus = 'אירעה שגיאה בטעינת כפתור התרומה. נסה לרענן את הדף.';
    };
    document.body.appendChild(script);
  }

  private renderPayPalButton(): void {
    if (!this.paypalButtonContainer || !paypal) {
      console.warn('PayPal button container not found or PayPal SDK not ready.');
      return;
    }

    // Ensure the container is empty before re-rendering
    this.paypalButtonContainer.nativeElement.innerHTML = '';

    paypal.Buttons({
      // Environment settings (sandbox for testing)
      env: environment.production ? 'production' : 'sandbox', // Use environment.production

      // Function to create an order
      createOrder: (data: any, actions: any) => {
        // console.log('Creating PayPal order...');
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.donationAmount.toFixed(2), // Ensure 2 decimal places
              currency_code: 'ILS' // Currency: Israeli Shekel
            }
          }]
        });
      },

      // Function after payment approval
      onApprove: (data: any, actions: any) => {
        // console.log('Order approved, attempting to capture:', data);
        // This is a critical step that should be done on the server-side in production!
        // Here we perform client-side capture for demonstration purposes only.
        return actions.order.capture().then((details: any) => {
          // console.log('Transaction completed by ' + details.payer.name.given_name, details);
          this.donationStatus = `תודה רבה על תרומתך בסך ${this.donationAmount} ILS, ${details.payer.name.given_name}!`;
          
          // Send confirmation email to the server
          if (this.currentUserEmail) {
            this.donationService.sendDonationConfirmationEmail({
              recipient_email: this.currentUserEmail,
              payer_name: details.payer.name.given_name || 'תורם יקר',
              amount: this.donationAmount,
              currency: 'ILS',
              transaction_id: details.id // PayPal Order ID
            }).subscribe({
              next: (res) => console.log('Email send request successful:', res),
              error: (err) => console.error('Failed to send email confirmation:', err)
            });
          } else {
            console.warn('Cannot send confirmation email: User email not available.');
          }

        }).catch((error: any) => {
          console.error('Error capturing order:', error);
          this.donationStatus = 'אירעה שגיאה בתהליך התרומה. אנא נסה שוב.';
        });
      },

      // Function in case of cancellation
      onCancel: (data: any) => {
        // console.log('Payment cancelled:', data);
        this.donationStatus = 'התרומה בוטלה.';
      },

      // Function in case of error
      onError: (err: any) => {
        console.error('PayPal button error:', err);
        this.donationStatus = 'אירעה שגיאה בכפתור התרומה. אנא נסה שוב מאוחר יותר.';
      }
    }).render(this.paypalButtonContainer.nativeElement); // Render the button into the div
  }

  // Function to handle donation amount change
  onAmountChange(): void {
    // Ensure the amount is positive and re-render the button if the amount has changed
    if (this.donationAmount > 0 && typeof paypal !== 'undefined' && this.paypalButtonContainer) {
      this.renderPayPalButton();
    }
  }
}
