import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMappingMaster } from './menu-mapping-master';

describe('MenuMappingMaster', () => {
  let component: MenuMappingMaster;
  let fixture: ComponentFixture<MenuMappingMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuMappingMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuMappingMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
