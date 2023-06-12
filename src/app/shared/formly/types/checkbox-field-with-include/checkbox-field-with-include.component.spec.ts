import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';

import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { CheckboxFieldWithIncludeComponent } from './checkbox-field-with-include.component';

describe('Checkbox Field With Include Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxFieldWithIncludeComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-checkbox-field-with-include', component: CheckboxFieldWithIncludeComponent }],
        }),
        FormlyTestingComponentsModule,
        MockComponent(ContentIncludeComponent),
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { active: true },
      fields: [
        {
          key: 'name',
          type: 'ish-checkbox-field-with-include',
          props: {
            hideRequiredMarker: true,
            required: true,
            labelInclude: 'include.general.02.pagelet2-Include',
          },
          validation: {
            messages: {
              required: 'toolineo.checkbox.legal.required',
            },
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
    expect(element.querySelector('ish-form-checkbox-with-include')).toBeTruthy();
  });
});
