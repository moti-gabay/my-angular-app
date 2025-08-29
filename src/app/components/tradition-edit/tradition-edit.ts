// src/app/tradition-edit/tradition-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TraditionService, TraditionItem } from '../../services/tradition'; // ייבוא השירות והממשק
import { FormsModule, NgForm } from '@angular/forms'; // לייבוא FormsModule ו-NgForm
import { CommonModule } from '@angular/common'; // לייבוא CommonModule
import { ChangeDetectorRef } from "@angular/core"
@Component({
  selector: 'app-tradition-edit',
  standalone: true,
  imports: [CommonModule, FormsModule], // ייבוא מודולים נדרשים
  templateUrl: './tradition-edit.html',
  styleUrls: ['./tradition-edit.css']
})
export class TraditionEditComponent implements OnInit {
  traditionItem: TraditionItem | null = null;
  loading: boolean = true;
  error: string = '';
  message: string = ''; // הודעות למשתמש (הצלחה/שגיאה)

  constructor(
    private route: ActivatedRoute,
    private router: Router, // הזרקת Router לניתוב מחדש
    private traditionService: TraditionService, // הזרקת השירות,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.traditionService.getTraditionItemById(id).subscribe({
          next: (data) => {
            this.traditionItem = data;
            this.loading = false;
            this.cdr.detectChanges()
          },
          error: (err) => {
            console.error('Error fetching tradition item for edit:', err);
            this.error = 'שגיאה בטעינת פריט המסורת לעריכה.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'מזהה פריט מסורת לא נמצא לעריכה.';
        this.loading = false;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.traditionItem && this.traditionItem.id) {
      this.message = ''; // נקה הודעות קודמות
      this.traditionService.updateTraditionItem(this.traditionItem.id, this.traditionItem).subscribe({
        next: (updatedItem) => {
          this.message = 'פריט המסורת עודכן בהצלחה!';
          // console.log('Tradition item updated:', updatedItem);
          // ניתוב חזרה לדף פריט המסורת המלאה
          this.router.navigate(['/tradition', this.traditionItem!.id]);
          // או: this.router.navigate(['/tradition']); // ניתוב לרשימת פריטי המסורת
        },
        error: (err) => {
          console.error('Error updating tradition item:', err);
          this.message = err.error?.message || 'שגיאה בעדכון פריט המסורת.';
          this.error = this.message; // גם לשגיאה
        }
      });
    } else {
      this.message = 'אנא מלא את כל השדות הנדרשים.';
    }
  }

  onCancel(): void {
    if (this.traditionItem && this.traditionItem.id) {
      this.router.navigate(['/tradition', this.traditionItem.id]); // חזרה לדף פריט המסורת הספציפית
    } else {
      this.router.navigate(['/tradition']); // אם אין ID, חזרה לרשימת המסורת
    }
  }
}
