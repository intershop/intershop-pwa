import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from './input.component';

describe('Input Component', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
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
  }));

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
    expect(element.querySelector('label.col-sm-4')).toBeTruthy();
    expect(element.querySelector('label + div.col-sm-8')).toBeTruthy();
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

  it('should render placeholder text if placeholderText set', () => {
    component.placeholderText = 'placeholder';
    fixture.detectChanges();
    expect(element.querySelector('input[placeholder=placeholder]')).toBeTruthy();
  });

  /*
    tests for parent class: form-element
  */

  it('should set input parameter labelClass on html element', () => {
    component.labelClass = 'col-sm-3';
    fixture.detectChanges();
    expect(element.querySelector('label.col-sm-3')).toBeTruthy();
  });

  it('should set input parameter inputClass on html element', () => {
    component.inputClass = 'col-sm-9';
    fixture.detectChanges();
    expect(element.querySelector('label + div.col-sm-9')).toBeTruthy();
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
