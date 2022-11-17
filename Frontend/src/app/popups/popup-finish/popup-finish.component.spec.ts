import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFinishComponent } from './popup-finish.component';

describe('PopupFinishComponent', () => {
  let component: PopupFinishComponent;
  let fixture: ComponentFixture<PopupFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupFinishComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
