import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { RadioFieldComponent } from './radio-field.component';

describe('Radio Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'radio', component: RadioFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
        TranslatePipe,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { rkey: '' },
      fields: [
        {
          key: 'rkey',
          type: 'radio',
          props: {
            label: 'radio-label',
            value: 'value1',
          },
        },
      ],
      form: new FormGroup({}),
    };

    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-radio-field')).toBeTruthy();
    expect(element.querySelector('ish-radio-field')).toMatchInlineSnapshot(`
      <ish-radio-field
        ><input
          type="radio"
          class="form-check-input ng-untouched ng-pristine ng-valid"
          id="formly_1_radio_rkey_0"
          ng-reflect-value="value1"
          data-testing-id="radio-radio-label"
          name="formly_0_formly-group__rkey"
      /></ish-radio-field>
    `);
  });
});
