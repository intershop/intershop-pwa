import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCalendar, NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { DatePickerFieldComponent } from './date-picker-field.component';

describe('Date Picker Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;
  let calendar: NgbCalendar;

  const templateOptionsVal = {
    minDays: of(2),
    maxDays: 'a',
    isSatExcluded: of(true),
    isSunExcluded: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerFieldComponent, MockComponent(FaIconComponent), MockDirective(NgbInputDatepicker)],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-date-picker-field', component: DatePickerFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
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
          key: 'desiredDeliveryDate',
          type: 'ish-date-picker-field',
          templateOptions: templateOptionsLoc,
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        desiredDeliveryDate: undefined,
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
    expect(element.querySelector('[data-testing-id="date-picker"]')).toBeTruthy();
  });

  it('should properly set min date', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.minDate).toEqual(calendar.getNext(calendar.getToday(), 'd', 2));
  });

  it('should not set max date because property is invalid', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.maxDate).toBeUndefined();
  });

  it('should disable sat the 12.03.2022', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.markDisabled(NgbDate.from({ year: 2022, month: 3, day: 12 }))).toBeTrue();
  });

  it('should enable sat the 12.03.2022', () => {
    const to = { ...templateOptionsVal, isSatExcluded: of(false) };

    setTestComponentInputs(to);

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.markDisabled(NgbDate.from({ year: 2022, month: 3, day: 12 }))).toBeFalse();
  });

  it('should disable suday the 13.03.2022', () => {
    setTestComponentInputs();

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.markDisabled(NgbDate.from({ year: 2022, month: 3, day: 13 }))).toBeTrue();
  });

  it('should enable suday the 13.03.2022', () => {
    const to = { ...templateOptionsVal, isSunExcluded: false };
    setTestComponentInputs(to);

    fixture.detectChanges();
    const datePickerDirective = fixture.debugElement
      .query(By.directive(NgbInputDatepicker))
      .injector.get(NgbInputDatepicker) as NgbInputDatepicker;

    expect(datePickerDirective.markDisabled(NgbDate.from({ year: 2022, month: 3, day: 13 }))).toBeFalse();
  });
});
