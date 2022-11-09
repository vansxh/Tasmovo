import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InsertGroupComponent} from './insert-group.component';

describe('InsertGroupComponent', () => {
  let component: InsertGroupComponent;
  let fixture: ComponentFixture<InsertGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsertGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InsertGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
