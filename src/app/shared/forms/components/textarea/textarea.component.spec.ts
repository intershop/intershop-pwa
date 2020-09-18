import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';

import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { TextareaComponent } from './textarea.component';

describe('Textarea Component', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockDirective(ShowFormFeedbackDirective), TextareaComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
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
    expect(element.querySelector('textarea')).toBeTruthy();
  });

  /** snapshot test is not possible here, because the id is a UUID */
  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    const labelClasses = element.querySelector('label').className;
    const inputClasses = element.querySelector('label + div').className;
    expect(labelClasses).toContain('col-md-4');
    expect(inputClasses).toContain('col-md-8');
    expect(element.querySelector('textarea').attributes.getNamedItem('rows').textContent).toBe('3');
    expect(element.querySelector('textarea').attributes.getNamedItem('placeholder').textContent).toBeEmpty();
  });

  it('should set textarea parameter rows on html element', () => {
    component.rows = 10;
    fixture.detectChanges();
    expect(element.querySelector('textarea').attributes.getNamedItem('rows').textContent).toBe('10');
  });

  it('should set textarea parameter placeholder on html element', () => {
    component.placeholder = 'Some Placeholder';
    fixture.detectChanges();
    expect(element.querySelector('textarea').attributes.getNamedItem('placeholder').textContent).toBe(
      'Some Placeholder'
    );
  });

  it('should set textarea parameter maxlength on html element and display remaining counter information', () => {
    component.maxlength = 100;
    fixture.detectChanges();
    expect(element.querySelector('textarea').attributes.getNamedItem('maxlength').textContent).toBe('100');
    expect(element.querySelector('small.input-help')).toBeTruthy();
  });

  it('should not set textarea parameter maxlength on html element and remaining counter info if maxlength is undefined', () => {
    component.maxlength = undefined;
    fixture.detectChanges();
    expect(element.querySelector('textarea').attributes.getNamedItem('maxlength')).toBeNull();
    expect(element.querySelector('small.input-help')).toBeFalsy();
  });

  /*
    tests for parent class: form-element
  */

  it('should set textarea parameter labelClass on html element', () => {
    component.labelClass = 'col-sm-5';
    fixture.detectChanges();
    expect(element.querySelector('label.col-sm-5')).toBeTruthy();
  });

  it('should set textarea parameter inputClass on html element', () => {
    component.inputClass = 'col-sm-5';
    fixture.detectChanges();
    expect(element.querySelector('label + div.col-sm-5')).toBeTruthy();
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

  it('should not render a label if label textarea parameter is missing', () => {
    component.label = '';
    fixture.detectChanges();
    expect(element.querySelector('label')).toBeFalsy();
  });

  // error are thrown if required textarea parameters are missing
  it('should throw an error if there is no form set as textarea parameter', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should throw an error if there is no controlName set as textarea parameter', () => {
    component.controlName = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should throw an error if there is no control with controlName in the given form', () => {
    component.controlName = 'xxx';
    expect(() => fixture.detectChanges()).toThrow();
  });
});
