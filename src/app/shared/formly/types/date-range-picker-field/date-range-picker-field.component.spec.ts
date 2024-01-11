import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { DateRangePickerFieldComponent } from './date-range-picker-field.component';

describe('Date Range Picker Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  const templateOptionsVal = {
    minDays: -365,
    maxDays: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateRangePickerFieldComponent, MockComponent(FaIconComponent), MockDirective(NgbInputDatepicker)],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-date-range-picker-field', component: DateRangePickerFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  const setTestComponentInputs = (templateOptionsLoc = templateOptionsVal) => {
    component.testComponentInputs = {
      fields: [
        {
          key: 'dateRange',
          type: 'ish-date-range-picker-field',
          props: templateOptionsLoc,
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        dateRange: undefined,
      },
    };
  };

  it('should be created', () => {
    setTestComponentInputs();

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="date-range-picker"]')).toBeTruthy();
  });
});
