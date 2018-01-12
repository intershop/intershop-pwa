import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { InputComponent } from './input.component';

describe('Input Component', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      if (data === 'labelKey') {
        return Observable.of('LabelName');
      } else {
        return Observable.of(null);
      }
    });
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          requiredField: new FormControl('', [Validators.required]),
          simpleField: new FormControl()
        });

        component.form = form;
        component.controlName = 'requiredField';
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should be rendered on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[data-testing-id=requiredField]')).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[type=text]')).toBeTruthy('type equals text');
    expect(element.querySelector('label.col-sm-4')).toBeTruthy('label class equals col-sm-4');
    expect(element.querySelector('label + div.col-sm-8')).toBeTruthy('input class equals col-sm-8');
    expect(element.querySelector('input[autocomplete]')).toBeFalsy('autocomplete not set for input type text');
  });

  it('should throw an error if input parameter type is not set properly', () => {
    component.type = 'xyz';
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should set input parameter type on html element', () => {
    component.type = 'email';
    fixture.detectChanges();
    expect(element.querySelector('input[type=email]')).toBeTruthy('type equals email');
  });

  it('should set input parameter autocomplete on html element', () => {
    component.autocomplete = 'off';
    fixture.detectChanges();
    expect(element.querySelector('input[autocomplete=off]')).toBeTruthy('autocomplete is set to false');
  });

  /*
    tests for parent class: form-element
  */

  it('should set input parameter labelClass on html element', () => {
    component.labelClass = 'col-sm-3';
    fixture.detectChanges();
    expect(element.querySelector('label.col-sm-3')).toBeTruthy('label class equals col-sm-3');
  });

  it('should set input parameter inputClass on html element', () => {
    component.inputClass = 'col-sm-9';
    fixture.detectChanges();
    expect(element.querySelector('label + div.col-sm-9')).toBeTruthy('input class equals col-sm-9');
  });

  // markAsRequired tests
  it('should set required asterix for required fields (default)', () => {
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeTruthy('markRequired label auto with required validator');
  });

  it('should set required asterix if MarkRequiredLabel = on', () => {
    component.markRequiredLabel = 'on';
    component.controlName = 'simpleField';
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeTruthy('markRequired label auto without required validator');
  });

  it('should not set required asterix if markRequiredLabel = off', () => {
    component.markRequiredLabel = 'off';
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeFalsy('markRequired label off with required validator');
  });

  it('should not set required asterix if MarkRequiredLabel = auto and the field is not required', () => {
    component.markRequiredLabel = 'auto';
    component.controlName = 'simpleField';
    fixture.detectChanges();
    expect(element.querySelector('span.required')).toBeFalsy('markRequired label auto without required validator');
  });

  // label tests
  it('should set label with controlName if label input parameter is missing', () => {
    fixture.detectChanges();
    expect(component.label).toEqual('requiredField');
  });

  it('should set label with a translation if translation key is set as label input parameter', () => {
    component.label = 'labelKey';
    fixture.detectChanges();
    expect(component.label).toEqual('LabelName');
  });

  it('should set label with label input parameter, if translation is not found', () => {
    component.label = 'label';
    fixture.detectChanges();
    expect(component.label).toEqual('label');
  });

  // error are thrown if required input parameters are missing
  it('should throw an error if there is no form set as input parameter', () => {
    component.form = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should throw an error if there is no controlName set as input parameter', () => {
    component.controlName = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should throw an error if there is no control with controlName in the given form', () => {
    component.controlName = 'xxx';
    expect(function() { fixture.detectChanges(); }).toThrow();
  });
});
