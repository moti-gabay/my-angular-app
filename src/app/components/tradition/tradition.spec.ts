import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tradition } from './tradition';

describe('Tradition', () => {
  let component: Tradition;
  let fixture: ComponentFixture<Tradition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tradition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tradition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
