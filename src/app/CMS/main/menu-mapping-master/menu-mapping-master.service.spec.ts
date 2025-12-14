import { TestBed } from '@angular/core/testing';

import { MenuMappingMasterService } from './menu-mapping-master.service';

describe('MenuMappingMasterService', () => {
  let service: MenuMappingMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuMappingMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
