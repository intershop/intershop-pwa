import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { SelectFieldComponent } from './select-field.component';

describe('Select Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-select-field', component: SelectFieldComponent }],
        }),
        FormlySelectModule,
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
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
          key: 'select',
          type: 'ish-select-field',
          props: {
            label: 'test label',
            required: true,
            options: [{ value: 1, label: 'test' }],
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        select: undefined,
      },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-select-field > select')).toBeTruthy();
  });
});
