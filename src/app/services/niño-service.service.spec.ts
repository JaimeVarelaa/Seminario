import { TestBed } from '@angular/core/testing';

import { NiñoServiceService } from './niño-service.service';

describe('NiñoServiceService', () => {
  let service: NiñoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiñoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
