import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { InputComponent } from './input.component';

describe('Input Component', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InputComponent,
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
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
    expect(element.querySelector('input[data-testing-id=requiredField]')).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[type=text]')).toBeTruthy();
    expect(element.querySelector('label.col-md-4')).toBeTruthy();
    expect(element.querySelector('label + div.col-md-8')).toBeTruthy();
    expect(element.querySelector('input[autocomplete]')).toBeFalsy();
  });

  it('should throw an error if input parameter type is not set properly', () => {
    component.type = 'xyz';
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should set input parameter type on html element', () => {
    component.type = 'email';
    fixture.detectChanges();
    expect(element.querySelector('input[type=email]')).toBeTruthy();
  });

  it('should set input parameter autocomplete on html element', () => {
    component.autocomplete = 'off';
    fixture.detectChanges();
    expect(element.querySelector('input[autocomplete=off]')).toBeTruthy();
  });

  it('should render placeholder text if placeholder set', () => {
    component.placeholder = 'placeholder';
    fixture.detectChanges();
    expect(element.querySelector('input[placeholder=placeholder]')).toBeTruthy();
  });

  it('should render a prepend string if prepend is set', () => {
    component.prepend = 'USD';
    fixture.detectChanges();
    expect(element.querySelector('.input-group')).toBeTruthy();
  });

  it('should not render a prepend string if prepend is not set', () => {
    fixture.detectChanges();
    expect(element.querySelector('.input-group')).toBeFalsy();
  });

  /*
    tests for parent class: form-element
  */

  it('should set input parameter labelClass on html element', () => {
    component.labelClass = 'col-md-3';
    fixture.detectChanges();
    expect(element.querySelector('label.col-md-3')).toBeTruthy();
  });

  it('should set input parameter inputClass on html element', () => {
    component.inputClass = 'col-md-9';
    fixture.detectChanges();
    expect(element.querySelector('label + div.col-md-9')).toBeTruthy();
  });

  // markAsRequired tests
  it('should set required asterix for required fields (default)', () => {
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeTruthy();
  });

  it('should set required asterix if MarkRequiredLabel = on', () => {
    component.markRequiredLabel = 'on';
    component.controlName = 'simpleField';
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeTruthy();
  });

  it('should not set required asterix if markRequiredLabel = off', () => {
    component.markRequiredLabel = 'off';
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeFalsy();
  });

  it('should not set required asterix if MarkRequiredLabel = auto and the field is not required', () => {
    component.markRequiredLabel = 'auto';
    component.controlName = 'simpleField';
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeFalsy();
  });

  it('should not render a label if label input parameter is missing', () => {
    component.label = '';
    fixture.detectChanges();
    expect(element.querySelector('label')).toBeFalsy();
  });

  // error are thrown if required input parameters are missing
  it('should throw an error if there is no form set as input parameter', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should throw an error if there is no controlName set as input parameter', () => {
    component.controlName = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should throw an error if there is no control with controlName in the given form', () => {
    component.controlName = 'xxx';
    expect(() => fixture.detectChanges()).toThrow();
  });
});
