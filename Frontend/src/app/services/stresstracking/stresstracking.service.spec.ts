import { TestBed } from '@angular/core/testing';

import { StresstrackingService } from './stresstracking.service';

describe('StresstrackingService', () => {
  let service: StresstrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StresstrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
