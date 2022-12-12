import { TestBed } from '@angular/core/testing';

import { MyDayService } from './my-day.service';

describe('MyDayService', () => {
  let service: MyDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
