import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { InformationFieldComponent } from './information-field.component';

describe('Information Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformationFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-information-field',
              component: InformationFieldComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'displayValue',
          type: 'ish-information-field',
          props: {
            containerClass: 'testClass',
            localizationKey: 'testKey',
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {},
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
    expect(element.querySelector('ish-information-field')?.innerHTML).toMatchInlineSnapshot(
      `"<div ng-reflect-ng-class="testClass" class="testClass">testKey</div>"`
    );
  });
});
