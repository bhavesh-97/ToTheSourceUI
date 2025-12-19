import { TestBed } from '@angular/core/testing';

import { MenuRightsMasterServices } from './menu-rights-master.services';

describe('MenuRightsMasterServices', () => {
  let service: MenuRightsMasterServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuRightsMasterServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
