import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMydayComponent } from './popup-myday.component';

describe('PopupMydayComponent', () => {
  let component: PopupMydayComponent;
  let fixture: ComponentFixture<PopupMydayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMydayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMydayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
