import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { RadioHorizontalWrapperComponent } from './radio-horizontal-wrapper.component';

describe('Radio Horizontal Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
          wrappers: [
            {
              name: 'form-field-radio-horizontal',
              component: RadioHorizontalWrapperComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [MockPipe(TranslatePipe), RadioHorizontalWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = {
      fields: [
        {
          key: 'example',
          type: 'example',
          wrappers: ['form-field-radio-horizontal'],
        },
      ] as FormlyFieldConfig[],
      model: {
        example: undefined,
      },
      form: new FormGroup({}),
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-radio-horizontal-wrapper')).toBeTruthy();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-radio-horizontal-wrapper')).toBeTruthy();
  });
});
