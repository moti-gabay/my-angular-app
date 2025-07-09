import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraditionInfo } from './tradition-info';

describe('TraditionInfo', () => {
  let component: TraditionInfo;
  let fixture: ComponentFixture<TraditionInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraditionInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraditionInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
