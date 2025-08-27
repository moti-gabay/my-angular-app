// src/app/news-add/news-add.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService, NewsItem } from '../../services/news';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-add.html',
  styleUrls: ['./news-add.css']
})
export class NewsAddComponent implements OnInit {
  // אובייקט FormData לאיפוס הטופס ואיסוף הנתונים
  formData: NewsItem = {
    title: '',
    description: '',
    full_content: '',
    image_url: ''
  };

  message: string = ''; // הודעות למשתמש (הצלחה/שגיאה)

  constructor(
    private router: Router,
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
    this.message = ''; // נקה הודעות עם אתחול
  }

  onSubmit(form: NgForm): void {
console.log('News item added:', this.formData);
    if (form.valid) {
      this.message = ''; // נקה הודעות קודמות
      this.newsService.createNewsItem(this.formData).subscribe({
        next: (newItem) => {
          this.message = 'הכתבה נוספה בהצלחה!';
          // console.log('News item added:', newItem);
          form.resetForm({ // איפוס הטופס לערכי ברירת מחדל
            title: '',
            description: '',
            full_content: '',
            image_url: ''
          });
          // ניתן לנווט לדף החדשות או לדף הכתבה החדשה
          // this.router.navigate(['/news', newItem._id]); 
          // או:
          // this.router.navigate(['/news']);
        },
        error: (err) => {
          console.error('Error adding news item:', err);
          this.message = err.error?.message || 'שגיאה בהוספת הכתבה.';
        }
      });
    } else {
      this.message = 'אנא מלא את כל השדות הנדרשים.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/news']); // חזרה לרשימת החדשות
  }
}
