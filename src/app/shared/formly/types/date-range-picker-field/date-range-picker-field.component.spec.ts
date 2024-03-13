import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCalendar, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { DateRangePickerFieldComponent } from './date-range-picker-field.component';

describe('Date Range Picker Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;
  let calendar: NgbCalendar;

  const templateOptionsVal = {
    minDays: -365 * 10, // 10 years ago
    maxDays: 'a',
    startDate: -5,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateRangePickerFieldComponent, MockComponent(FaIconComponent), MockDirective(NgbInputDatepicker)],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-date-range-picker-field', component: DateRangePickerFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    calendar = TestBed.inject(NgbCalendar);
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

  it('should properly set start date 5 days from now', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    const expectedStartDate = calendar.getPrev(calendar.getToday(), 'd', 5);

    expect(datePickerDirective.startDate).toEqual(expectedStartDate);
  });

  it('should not set max date because property is invalid', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.maxDate).toBeUndefined();
  });
});
