import { TestBed } from '@angular/core/testing';

import { RolemasterService } from './rolemaster.service';

describe('RolemasterService', () => {
  let service: RolemasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolemasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
