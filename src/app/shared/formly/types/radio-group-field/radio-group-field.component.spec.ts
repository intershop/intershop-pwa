import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { formlyTestingImports } from 'ish-shared/formly/dev/testing/formly-testing.imports';

import { RadioGroupFieldComponent } from './radio-group-field.component';

describe('Radio Group Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ...formlyTestingImports,
        FormlyModule.forRoot({
          types: [{ name: 'ish-radio-group-field', component: RadioGroupFieldComponent }],
        }),
        FormlySelectModule,
        RadioGroupFieldComponent,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { budgetPriceType: 'net' },
      fields: [
        {
          key: 'budgetPriceType',
          type: 'ish-radio-group-field',
          defaultValue: 'gross',
          props: {
            label: 'Blubber',
            options: [
              {
                value: 'gross',
                label: 'account.customer.price_type.gross.label',
              },
              {
                value: 'net',
                label: 'account.customer.price_type.net.label',
              },
            ],
          },
        },
      ],
      form: new FormGroup({}),
    };

    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.testComponentInputs = testComponentInputs;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-radio-group-field')).toBeTruthy();
  });

  it('should be linked to the model after creation', () => {
    fixture.detectChanges();
    expect(component.form.get('budgetPriceType')).toContainValue('net');
  });
});
