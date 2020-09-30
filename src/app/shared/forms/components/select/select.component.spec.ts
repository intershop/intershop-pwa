import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { SelectComponent, SelectOption } from './select.component';

describe('Select Component', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
        SelectComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      simpleField: new FormControl(),
      requiredField: new FormControl('', [Validators.required]),
    });
    const options: SelectOption[] = [
      { label: 'optionLabel', value: 'optionValue' },
      { label: 'optionLabel2', value: 'optionValue2' },
    ];

    component.label = 'label';
    component.form = form;
    component.controlName = 'simpleField';
    component.options = options;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered on creation and show options', () => {
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=simpleField]')).toBeTruthy();
    expect(element.querySelector('select[data-testing-id=simpleField] option[value = optionValue ]')).toBeTruthy();
    expect(
      element.querySelector('select[data-testing-id=simpleField] option[value = optionValue ]').innerHTML
    ).toContain('optionLabel');
    expect(
      element.querySelector('select[data-testing-id=simpleField] option[value = optionValue2 ]').innerHTML
    ).toContain('optionLabel2');
  });

  it('should not be rendered if there are no options and no required validator', () => {
    component.options = undefined;
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=simpleField]')).toBeFalsy();
  });

  it('should be rendered if there are no options but a required validator', () => {
    component.controlName = 'requiredField';
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=requiredField]')).toBeTruthy();
  });

  it('should show empty option if no value is set', () => {
    fixture.detectChanges();
    expect(component.showEmptyOption).toBeTruthy();
    expect(element.querySelector('select[data-testing-id=simpleField] option[value=""]')).toBeTruthy();
  });

  it('should not show empty option if a value is set', () => {
    component.form.get(component.controlName).setValue('optionValue');
    fixture.detectChanges();
    expect(component.showEmptyOption).toBeFalsy();
    expect(element.querySelector('select[data-testing-id=simpleField] option[value=""]')).toBeFalsy();
  });

  it('should not render a label if label input parameter is missing', () => {
    component.label = '';
    fixture.detectChanges();
    expect(element.querySelector('label')).toBeFalsy();
  });

  it('should set input parameter labelClass on html element', () => {
    component.labelClass = 'col-md-3';
    fixture.detectChanges();
    expect(element.querySelector('label.col-md-3')).toBeTruthy();
  });

  it('should set input parameter inputClass on html element: ', () => {
    component.inputClass = 'col-md-9';
    fixture.detectChanges();
    expect(element.querySelector('label + div.col-md-9')).toBeTruthy();
  });
});
