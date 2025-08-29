// src/app/tradition-article/tradition-article.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TraditionService, TraditionItem } from '../../services/tradition'; // ייבוא השירות והממשק
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // לייבוא DomSanitizer
import { ChangeDetectorRef } from "@angular/core"
import { API_URL } from '../../services/url';
@Component({
  selector: 'app-tradition-article',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './tradition-info.html',
  styleUrls: ['./tradition-info.css']
})
export class TraditionInfo implements OnInit {
  traditionItem: TraditionItem | null = null;
  loading: boolean = true;
  error: string = '';
  safeFullContent: SafeHtml | null = null; // לתוכן HTML בטוח

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private traditionService: TraditionService,
    private sanitizer: DomSanitizer // הזרקת DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.error = '';
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // קבלת ה-ID מכתובת ה-URL
      if (id) {
        this.traditionService.getTraditionItemById(id).subscribe({
          next: (data) => {
            this.traditionItem = data;
            // אם full_content מכיל HTML, סמן אותו כבטוח
            if (this.traditionItem && this.traditionItem.full_content) {
              this.safeFullContent = this.sanitizer.bypassSecurityTrustHtml(this.traditionItem.full_content);
            }
            this.loading = false;
            this.cdr.detectChanges()
          },
          error: (err) => {
            console.error('שגיאה בשליפת פריט מסורת:', err);
            this.error = 'שגיאה בטעינת פריט המסורת.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'מזהה פריט מסורת לא נמצא.';
        this.loading = false;
      }
    });
  }

  getFullImageUrl(relativeUrl: string | undefined): string {
    if (!relativeUrl) {
      return 'https://placehold.co/600x400/cccccc/333333?text=אין+תמונה'; // תמונת פלייס הולדר
    }
    // הנחה: API_URL הוא 'http://localhost:5000/api' והתמונות מוגשות מ- 'http://localhost:5000'
    const baseUrl = API_URL;
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl; // אם זה כבר URL מלא
    }
    return `${baseUrl}${relativeUrl}`;
  }
}
