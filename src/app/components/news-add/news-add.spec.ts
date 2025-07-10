import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAdd } from './news-add';

describe('NewsAdd', () => {
  let component: NewsAdd;
  let fixture: ComponentFixture<NewsAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
