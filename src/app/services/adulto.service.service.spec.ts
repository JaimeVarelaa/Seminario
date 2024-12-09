import { TestBed } from '@angular/core/testing';

import { AdultoServiceService } from './adulto.service.service';

describe('AdultoServiceService', () => {
  let service: AdultoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdultoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
