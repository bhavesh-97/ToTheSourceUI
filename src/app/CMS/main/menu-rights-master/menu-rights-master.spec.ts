import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRightsMaster } from './menu-rights-master';

describe('MenuRightsMaster', () => {
  let component: MenuRightsMaster;
  let fixture: ComponentFixture<MenuRightsMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRightsMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRightsMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
