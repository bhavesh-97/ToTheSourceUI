import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsapMaster } from './gsap-master';

describe('GsapMaster', () => {
  let component: GsapMaster;
  let fixture: ComponentFixture<GsapMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GsapMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GsapMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
