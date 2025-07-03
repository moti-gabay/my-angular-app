import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedEvents } from './approved-events';

describe('ApprovedEvents', () => {
  let component: ApprovedEvents;
  let fixture: ComponentFixture<ApprovedEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
