import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { CheckboxComponent } from './checkbox.component';

describe('Checkbox Component', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckboxComponent,
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      requiredField: new FormControl('', [Validators.required]),
      simpleField: new FormControl(),
    });
    component.label = 'label';
    component.form = form;
    component.controlName = 'requiredField';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=requiredField]')).toBeTruthy();
  });

  it('should set input type properly on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[type=checkbox]')).toBeTruthy();
  });
});
