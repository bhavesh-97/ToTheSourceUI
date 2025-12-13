import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuResourceMaster } from './menu-resource-master';

describe('MenuResourceMaster', () => {
  let component: MenuResourceMaster;
  let fixture: ComponentFixture<MenuResourceMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuResourceMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuResourceMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
