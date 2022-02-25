import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';
import { FieldsetFieldComponent } from 'ish-shared/formly/types/fieldset-field/fieldset-field.component';

describe('Formly Testing Fieldgroup Example Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-fieldset-field',
              component: FieldsetFieldComponent,
            },
            { name: 'example', component: FormlyTestingExampleComponent },
          ],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [FieldsetFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          type: 'ish-fieldset-field',
          fieldGroup: [
            {
              key: 'ex1',
              type: 'example',
            },
            {
              key: 'ex2',
              type: 'example',
            },
          ],
        },
      ],
      model: {
        ex1: '',
        ex2: '',
      },
      form: new FormGroup({}),
    };

    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
  });
  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should contain both of the example fields wrapped in a fieldset', () => {
    expect(findAllCustomElements(element.querySelector('fieldset'))).toMatchInlineSnapshot(`
      Array [
        "formly-field",
        "ish-formly-testing-example",
        "formly-field",
        "ish-formly-testing-example",
      ]
    `);
  });
});
