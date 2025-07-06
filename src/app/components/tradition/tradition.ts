import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tradition',
  templateUrl: './tradition.html',
  styleUrls: ['./tradition.css'],
  imports: [CommonModule], // זה מה שהיה חסר

})
export class Tradition {
  logoPath = "assets/images/logo.png"
  selectedTopic: string = 'summary';

  topics = [
    { id: 'batMitzvah', label: 'בת מצווה' },
    { id: 'barMitzvah', label: 'בר מצווה' },
    { id: 'shabbat', label: 'הפרשת חלה' },
    { id: 'holidays', label: 'חגי ישראל' }
  ];

  selectTopic(topicId: string) {
    this.selectedTopic = topicId;
  }
}
