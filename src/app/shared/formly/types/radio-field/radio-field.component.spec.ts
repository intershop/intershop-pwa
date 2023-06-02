import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { RadioFieldComponent } from './radio-field.component';

describe('Radio Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'radio', component: RadioFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
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
          class="form-check-input"
          value="value1"
          id="formly_1_radio_rkey_0"
          name="formly_0_formly-group__rkey"
          data-testing-id="radio-radio-label"
      /></ish-radio-field>
    `);
  });
});
