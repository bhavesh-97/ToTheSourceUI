import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePlaceholder } from './template-placeholder';

describe('TemplatePlaceholder', () => {
  let component: TemplatePlaceholder;
  let fixture: ComponentFixture<TemplatePlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatePlaceholder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatePlaceholder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
