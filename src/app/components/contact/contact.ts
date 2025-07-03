import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./contact.css'],
  standalone: true
})
export class ContactComponent {
  formData = {
    title: '',
    date: '',
    time: '',
    location: '',
    needed_volunteers: 0,
    registered_count: 0, // ברירת מחדל
    description: '',
    is_approved: false,  // ברירת מחדל
    created_by: 0, // תעדכן לפי היוזר המחובר
    equipment: ''
  };

  message: string = '';

  constructor(private http: HttpClient, private eventService: EventService) { }

  onSubmit(form: NgForm) {
    const dataToSend = { ...this.formData };
    dataToSend.time += ":00";
    // אם אתה רוצה, תוכל לאחד את שדה ה"ציוד נדרש" עם התיאור
    if (this.formData.equipment) {
      dataToSend.description += `\n\nציוד נדרש: ${this.formData.equipment}`;
    }
    this.eventService.createEvent(dataToSend).subscribe({
      next: () => {
        alert("פרטי האירוע נשלחו בהצלחה!")
        form.resetForm({ // קורא ל-resetForm על אובייקט הטופס שהתקבל
          title: '',
          date: '',
          time: '',
          location: '',
          needed_volunteers: 0,
          registered_count: 0,
          description: '',
          is_approved: false,
          created_by: 0,
          equipment: ''
        });
      },
      error: (err) => console.log(err)
    })
    // תעדכן את created_by לפי היוזר המחובר


  }
}
