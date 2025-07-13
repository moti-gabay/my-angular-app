import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraditionEdit } from './tradition-edit';

describe('TraditionEdit', () => {
  let component: TraditionEdit;
  let fixture: ComponentFixture<TraditionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraditionEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraditionEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
