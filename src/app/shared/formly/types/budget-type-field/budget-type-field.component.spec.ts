import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { BudgetTypeFieldComponent } from './budget-type-field.component';

describe('Budget Type Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTypeFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-budget-type-field', component: BudgetTypeFieldComponent }],
        }),
        FormlySelectModule,
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { budgetPriceType: 'net' },
      fields: [
        {
          key: 'budgetPriceType',
          type: 'ish-budget-type-field',
          defaultValue: 'gross',
          props: {
            label: 'Blubber',
            options: [
              {
                value: 'gross',
                label: 'account.costcenter.gross.label',
              },
              {
                value: 'net',
                label: 'account.costcenter.net.label',
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
    expect(element.querySelector('ish-budget-type-field')).toBeTruthy();
  });

  it('should be linked to the model after creation', () => {
    fixture.detectChanges();
    expect(component.form.get('budgetPriceType')).toContainValue('net');
  });
});
