import { Component } from '@angular/core';
import { ImageListComponent } from '../image-list/image-list';

@Component({
  selector: 'app-home-page',
  imports: [ImageListComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
