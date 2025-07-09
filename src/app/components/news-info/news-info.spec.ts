import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsInfo } from './news-info';

describe('NewsInfo', () => {
  let component: NewsInfo;
  let fixture: ComponentFixture<NewsInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
