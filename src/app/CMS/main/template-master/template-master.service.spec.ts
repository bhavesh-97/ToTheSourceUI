import { TestBed } from '@angular/core/testing';

import { TemplateMasterService } from './template-master.service';

describe('TemplateMasterService', () => {
  let service: TemplateMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
