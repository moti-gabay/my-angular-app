import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  timeAgo: string; // לדוגמה: '23 דקות'
}

@Component({
  selector: 'app-news',
  templateUrl: './news.html',
  styleUrls: ['./news.css'],
    imports: [CommonModule],

})
export class News implements OnInit {

  news: NewsItem[] = [
      {
        id: 1,
        title: 'עשרות אלפים בהילולת משה רבנו',
        description: 'אלפי המאמינים הגיעו לציונו של משה רבנו וערכו הילולה מרגשת.',
        imageUrl: 'assets/images/logo.png',
        timeAgo: 'לפני 23 דקות'
      },
      {
        id: 2,
        title: 'הכנסת ספר תורה לישוב החדש',
        description: 'שמחה גדולה ביישוב עם הכנסת ספר תורה מרגשת בהשתתפות התושבים.',
        imageUrl: 'assets/images/logo.png',
        timeAgo: 'לפני שעה'
      }
      // תוכל להוסיף עוד פריטים
    ];

  ngOnInit() {
    this.news = [
      {
        id: 1,
        title: 'עשרות אלפים בהילולת משה רבנו',
        description: 'אלפי המאמינים הגיעו לציונו של משה רבנו וערכו הילולה מרגשת.',
        imageUrl: 'assets/images/news1.jpg',
        timeAgo: 'לפני 23 דקות'
      },
      {
        id: 2,
        title: 'הכנסת ספר תורה לישוב החדש',
        description: 'שמחה גדולה ביישוב עם הכנסת ספר תורה מרגשת בהשתתפות התושבים.',
        imageUrl: 'assets/images/news2.jpg',
        timeAgo: 'לפני שעה'
      }
      // תוכל להוסיף עוד פריטים
    ];
  }
}
