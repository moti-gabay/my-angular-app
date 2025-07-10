// src/app/news-edit/news-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService, NewsItem } from '../../services/news';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from "@angular/core"
@Component({
  selector: 'app-news-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-edit.html',
  styleUrls: ['./news-edit.css']
})
export class NewsEditComponent implements OnInit {
  newsItem: NewsItem | null = null;
  loading: boolean = true;
  error: string = '';
  message: string = '';

  // השאר את 'router' כ-private, אך הוסף את הגישה דרך מתודה ציבורית
  constructor(
    private route: ActivatedRoute,
    private router: Router, // נשאר private כאן
    private newsService: NewsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.newsService.getNewsItemById(parseInt(id, 10)).subscribe({
          next: (data) => {
            this.newsItem = data;
            this.loading = false;
            this.cdr.detectChanges()
          },
          error: (err) => {
            console.error('Error fetching news item for edit:', err);
            this.error = 'שגיאה בטעינת הכתבה לעריכה.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'מזהה כתבה לא נמצא לעריכה.';
        this.loading = false;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.newsItem && this.newsItem.id) {
      this.message = '';
      this.newsService.updateNewsItem(this.newsItem.id, this.newsItem).subscribe({
        next: (updatedItem) => {
          this.message = 'הכתבה עודכנה בהצלחה!';
          console.log('News item updated:', updatedItem);
          // ניתוב חזרה לדף הכתבה המלאה
          this.router.navigate(['/news', this.newsItem!.id]);
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error('Error updating news item:', err);
          this.message = err.error?.message || 'שגיאה בעדכון הכתבה.';
          this.error = this.message;
        }
      });
    } else {
      this.message = 'אנא מלא את כל השדות הנדרשים.';
    }
  }

  // <--- מתודה ציבורית חדשה לניווט חזרה
  onCancel(): void {
    if (this.newsItem && this.newsItem.id) {
      this.router.navigate(['/news', this.newsItem.id]); // חזרה לדף הכתבה הספציפית
    } else {
      this.router.navigate(['/news']); // אם אין ID, חזרה לרשימת החדשות
    }
  }
}
