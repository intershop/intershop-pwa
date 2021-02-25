import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { HorizontalCheckboxWrapperComponent } from './horizontal-checkbox-wrapper.component';

describe('Horizontal Checkbox Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
          wrappers: [{ name: 'form-field-checkbox-horizontal', component: HorizontalCheckboxWrapperComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [
        HorizontalCheckboxWrapperComponent,
        MockComponent(ValidationMessageComponent),
        MockPipe(TranslatePipe),
      ],
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
          wrappers: ['form-field-checkbox-horizontal'],
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
    expect(element.querySelector('ish-horizontal-checkbox-wrapper')).toBeTruthy();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-horizontal-checkbox-wrapper')).toBeTruthy();
  });
});
