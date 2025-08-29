import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAddComponent } from './news-add';

describe('NewsAdd', () => {
  let component:  NewsAddComponent;
  let fixture: ComponentFixture<NewsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
