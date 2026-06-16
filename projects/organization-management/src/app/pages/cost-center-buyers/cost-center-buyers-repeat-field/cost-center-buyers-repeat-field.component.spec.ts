import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';
import { formlyTestingImports } from 'ish-shared/formly/dev/testing/formly-testing.imports';

import { CostCenterBuyersRepeatFieldComponent } from './cost-center-buyers-repeat-field.component';

describe('Cost Center Buyers Repeat Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ...formlyTestingImports,
        CostCenterBuyersRepeatFieldComponent,
        FormlyModule.forRoot({
          types: [
            { name: 'buyerRepeatField', component: CostCenterBuyersRepeatFieldComponent },
            { name: 'example', component: FormlyTestingExampleComponent },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {
        buyers: [{}, {}],
      },
      form: new FormGroup({}),
      fields: [
        {
          key: 'buyers',
          type: 'buyerRepeatField',
          fieldArray: {
            fieldGroup: [
              {
                key: 'example',
                type: 'example',
              },
            ],
          },
        },
      ],
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

  it('should render two form groups after creation with a model containing two objects', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element.querySelector('ish-cost-center-buyers-repeat-field'))).toMatchInlineSnapshot(`
      [
        "ish-cost-center-buyers-repeat-field",
        "formly-field",
        "formly-group",
        "formly-field",
        "ish-formly-testing-example",
        "formly-field",
        "formly-group",
        "formly-field",
        "ish-formly-testing-example",
      ]
    `);
  });
});
