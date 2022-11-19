import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTasksComponent } from './single-tasks.component';

describe('SingleTasksComponent', () => {
  let component: SingleTasksComponent;
  let fixture: ComponentFixture<SingleTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
