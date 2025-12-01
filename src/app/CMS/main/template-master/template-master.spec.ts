import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateMaster } from './template-master';

describe('TemplateMaster', () => {
  let component: TemplateMaster;
  let fixture: ComponentFixture<TemplateMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
