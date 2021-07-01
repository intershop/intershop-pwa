import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickorderRepeatFormSectionComponent } from './quickorder-repeat-form-section.component';

describe('Quickorder Repeat Form Section Component', () => {
  let component: QuickorderRepeatFormSectionComponent;
  let fixture: ComponentFixture<QuickorderRepeatFormSectionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickorderRepeatFormSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderRepeatFormSectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
