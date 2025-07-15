// src/app/contact/contact.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactFormData } from '../../services/contact'; // ייבוא ContactService

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  contactData: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  statusMessage: string = '';
  isSuccess: boolean = false;

  constructor(private contactService: ContactService) { } // הזרקת ContactService

  onSubmit(): void {
    this.statusMessage = ''; // נקה הודעות קודמות

    // וודא שכל השדות הנדרשים מלאים
    if (!this.contactData.name || !this.contactData.email || !this.contactData.message) {
      this.statusMessage = 'אנא מלא את כל השדות המסומנים בכוכבית.';
      this.isSuccess = false;
      return;
    }

    // console.log('Contact Form Submitted:', this.contactData);

    this.contactService.sendContactForm(this.contactData).subscribe({
      next: (res: any) => {
        this.statusMessage = 'הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.';
        this.isSuccess = true;
        this.resetForm();
        // console.log('Contact email send request successful:', res);
      },
      error: (err: any) => {
        this.statusMessage = 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.';
        this.isSuccess = false;
        console.error('Failed to send contact email:', err);
      }
    });
  }

  private resetForm(): void {
    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
