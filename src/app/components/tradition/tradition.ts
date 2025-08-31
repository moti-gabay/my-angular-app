// src/app/tradition/tradition.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraditionService, TraditionItem } from '../../services/tradition';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router'; // <--- ייבוא RouterLink
import { ChangeDetectorRef } from "@angular/core"
import { AuthService } from '../../services/auth';
import { map } from 'rxjs';
import { API_URL } from '../../services/url';
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
    this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin')
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.fetchTraditionItems();
  }

  fetchTraditionItems(): void {
    this.loading = true;
    this.error = '';
    this.traditionService.getAllTraditionItems().subscribe({
      next: (data) => {
        this.traditionItems = data;
        this.loading = false;
        // console.log('פריטי מסורת נטענו בהצלחה:', this.traditionItems);
        this.cdr.detectChanges()
        if (this.traditionItems.length > 0) {
          // this.selectTopic(this.traditionItems[0]._id!);
        }
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת פריטי המסורת. אנא נסה שוב מאוחר יותר.';
        this.loading = false;
        console.error('שגיאה בשליפת פריטי מסורת:', err);
      }
    });
  }

  selectTopic(itemId: string): void {
    const foundItem = this.traditionItems.find(item => item.id?.toString() === itemId);
    if (foundItem) {
      this.selectedTraditionItem = foundItem;
      if (this.selectedTraditionItem.full_content) {
        this.safeFullContent = this.sanitizer.bypassSecurityTrustHtml(this.selectedTraditionItem.full_content);
      } else {
        this.safeFullContent = null;
      }
      // console.log('פריט מסורת נבחר:', this.selectedTraditionItem.title);
    }
  }

   deleteTraditionItem(id: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט מסורת זה?')) {
      this.traditionService.deleteTraditionItem(id).subscribe({
        next: () => {
          alert('פריט המסורת נמחק בהצלחה.');
          this.fetchTraditionItems(); 
          // this.selectTopic(this.traditionItems[0]._id!);
 // רענן את רשימת הפריטים לאחר המחיקה
        },
        error: (err) => {
          console.error('שגיאה במחיקת פריט מסורת:', err);
          alert('שגיאה במחיקת פריט המסורת.');
        }
      });
    }
  }


  getFullImageUrl(relativeUrl: string | undefined): string {
    if (!relativeUrl) {
      return 'https://placehold.co/600x400/cccccc/333333?text=אין+תמונה';
    }
    const baseUrl = API_URL;
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    return `${baseUrl}${relativeUrl}`;
  }
}
