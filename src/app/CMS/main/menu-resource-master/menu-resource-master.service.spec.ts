import { TestBed } from '@angular/core/testing';

import { MenuResourceMasterService } from './menu-resource-master.service';

describe('MenuResourceMasterService', () => {
  let service: MenuResourceMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuResourceMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
