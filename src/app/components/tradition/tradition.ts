// src/app/tradition/tradition.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // לייבוא CommonModule עבור ngSwitch, ngFor, ngIf

@Component({
  selector: 'app-tradition',
  standalone: true,
  imports: [CommonModule], // וודא ש-CommonModule מיובא
  templateUrl: './tradition.html',
  styleUrls: ['./tradition.css']
})
export class Tradition implements OnInit {
  topics = [
    { id: 'batMitzvah', label: 'בת מצווה' },
    { id: 'barMitzvah', label: 'בר מצווה' },
    { id: 'shabbat', label: 'הפרשת חלה' },
    { id: 'holidays', label: 'חגי ישראל' }
  ];
  selectedTopic: string = 'batMitzvah'; // נושא ברירת מחדל

  constructor() { }

  ngOnInit(): void {
    console.log('TraditionComponent loaded.');
  }

  selectTopic(topicId: string): void {
    this.selectedTopic = topicId;
  }
}
