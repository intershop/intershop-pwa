import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../select/select-option.interface';
import { SelectComponent } from './select.component';

describe('Select Component', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent],
      providers: [
        { provide: TranslateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          simpleField: new FormControl(),
          requiredField: new FormControl('', [Validators.required])
        });
        const options: SelectOption[] = [{ 'label': 'optionLabel', 'value': 'optionValue' }, { 'label': 'optionLabel2', 'value': 'optionValue2' }];

        component.form = form;
        component.controlName = 'simpleField';
        component.options = options;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should be rendered on creation and show options', () => {
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=simpleField]')).toBeTruthy('select is rendered');
    expect(element.querySelector('select[data-testing-id=simpleField] option[value = optionValue ]')).toBeTruthy('option with the correct value is rendered');
    expect(element.querySelector('select[data-testing-id=simpleField] option[value = optionValue ]').innerHTML).toContain('optionLabel', 'option with the correct value and label is rendered');
    expect(element.querySelector('select[data-testing-id=simpleField] option[value = optionValue2 ]').innerHTML).toContain('optionLabel2', '2nd option with the correct value and label is rendered');
  });

  it('should not be rendered if there are no options and no required validator', () => {
    component.options = null;
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
    expect(component.showEmptyOption).toBeTruthy('showEmptyOption is set to true');
    expect(element.querySelector('select[data-testing-id=simpleField] option[value=""]')).toBeTruthy('empty option is displayed');
  });

  it('should not show empty option if a value is set', () => {
    component.form.get(component.controlName).setValue('optionValue');
    fixture.detectChanges();
    expect(component.showEmptyOption).toBeFalsy('showEmptyOption is set to false');
    expect(element.querySelector('select[data-testing-id=simpleField] option[value=""]')).toBeFalsy('empty option is not displayed');
  });

  it('should set input parameter labelClass on html element', () => {
    component.labelClass = 'col-sm-3';
    fixture.detectChanges();
    expect(element.querySelector('label.col-sm-3')).toBeTruthy('label class equals col-sm-3');
  });

  it('should set input parameter inputClass on html element: ', () => {
    component.inputClass = 'col-sm-9';
    fixture.detectChanges();
    expect(element.querySelector('label + div.col-sm-9')).toBeTruthy('input class equals col-sm-9');
  });

});
