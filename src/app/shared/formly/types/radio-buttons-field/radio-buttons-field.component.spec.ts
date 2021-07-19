import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonsFieldComponent } from './radio-buttons-field.component';

describe('Radio Buttons Field Component', () => {
  let component: RadioButtonsFieldComponent;
  let fixture: ComponentFixture<RadioButtonsFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioButtonsFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonsFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
