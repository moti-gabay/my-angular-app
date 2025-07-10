import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraditionAdd } from './tradition-add';

describe('TraditionAdd', () => {
  let component: TraditionAdd;
  let fixture: ComponentFixture<TraditionAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraditionAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraditionAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
