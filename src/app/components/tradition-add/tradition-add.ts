// src/app/tradition-add/tradition-add.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TraditionService, TraditionItem } from '../../services/tradition'; // ייבוא השירות והממשק
import { FormsModule, NgForm } from '@angular/forms'; // לייבוא FormsModule ו-NgForm
import { CommonModule } from '@angular/common'; // לייבוא CommonModule

@Component({
  selector: 'app-tradition-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tradition-add.html',
  styleUrls: ['./tradition-add.css']
})
export class TraditionAddComponent implements OnInit {
  // אובייקט FormData לאיפוס הטופס ואיסוף הנתונים
  formData: TraditionItem = {
    title: '',
    short_description: '',
    full_content: '',
    category: '',
    image_url: ''
  };
  
  message: string = ''; // הודעות למשתמש (הצלחה/שגיאה)

  constructor(
    private router: Router,
    private traditionService: TraditionService // הזרקת השירות
  ) { }

  ngOnInit(): void {
    this.message = ''; // נקה הודעות עם אתחול
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.message = ''; // נקה הודעות קודמות
      this.traditionService.createTraditionItem(this.formData).subscribe({
        next: (newItem:TraditionItem) => {
          this.message = 'פריט המסורת נוסף בהצלחה!';
          form.resetForm({ // איפוס הטופס לערכי ברירת מחדל
            title: '',
            short_description: '',
            full_content: '',
            category: '',
            image_url: ''
          });
          // ניתן לנווט לדף רשימת המסורת או לדף הפריט החדש
          // this.router.navigate(['/tradition', newItem._id]); 
          // או:
          this.router.navigate(['/tradition']);
        },
        error: (err:any) => {
          console.error('Error adding tradition item:', err);
          this.message = err.error?.message || 'שגיאה בהוספת פריט המסורת.';
        }
      });
    } else {
      this.message = 'אנא מלא את כל השדות הנדרשים.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/tradition']); // חזרה לרשימת פריטי המסורת
  }
}
