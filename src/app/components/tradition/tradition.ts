// src/app/tradition/tradition.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraditionService, TraditionItem } from '../../services/tradition';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router'; // <--- ייבוא RouterLink
import { ChangeDetectorRef } from "@angular/core"
import { AuthService } from '../../services/auth';
import { map } from 'rxjs';
@Component({
  selector: 'app-tradition',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- הוספת RouterLink ל-imports
  templateUrl: './tradition.html',
  styleUrls: ['./tradition.css']
})
export class Tradition implements OnInit {
  traditionItems: TraditionItem[] = [];
  selectedTraditionItem: TraditionItem | null = null;
  safeFullContent: SafeHtml | null = null;
  isAdmin: boolean = false;

  loading: boolean = true;
  error: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private traditionService: TraditionService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchTraditionItems();
  }

  fetchTraditionItems(): void {
    this.loading = true;
    this.error = '';
    this.traditionService.getAllTraditionItems().subscribe({
      next: (data) => {
        this.traditionItems = data;
        this.loading = false;
        console.log('פריטי מסורת נטענו בהצלחה:', this.traditionItems);
        this.cdr.detectChanges()
        if (this.traditionItems.length > 0) {
          this.selectTopic(this.traditionItems[0].id!);
        }
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת פריטי המסורת. אנא נסה שוב מאוחר יותר.';
        this.loading = false;
        console.error('שגיאה בשליפת פריטי מסורת:', err);
      }
    });
  }

  selectTopic(itemId: number): void {
    const foundItem = this.traditionItems.find(item => item.id === itemId);
    if (foundItem) {
      this.selectedTraditionItem = foundItem;
      if (this.selectedTraditionItem.full_content) {
        this.safeFullContent = this.sanitizer.bypassSecurityTrustHtml(this.selectedTraditionItem.full_content);
      } else {
        this.safeFullContent = null;
      }
      console.log('פריט מסורת נבחר:', this.selectedTraditionItem.title);
    }
  }

  getFullImageUrl(relativeUrl: string | undefined): string {
    if (!relativeUrl) {
      return 'https://placehold.co/600x400/cccccc/333333?text=אין+תמונה';
    }
    const baseUrl = 'http://localhost:5000';
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    return `${baseUrl}${relativeUrl}`;
  }
}
