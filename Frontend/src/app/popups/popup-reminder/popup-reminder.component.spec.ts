import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupReminderComponent } from './popup-reminder.component';

describe('PopupReminderComponent', () => {
  let component: PopupReminderComponent;
  let fixture: ComponentFixture<PopupReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupReminderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
