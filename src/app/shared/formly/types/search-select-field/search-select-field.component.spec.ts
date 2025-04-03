import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { MockComponent } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { SearchSelectFieldComponent } from './search-select-field.component';

describe('Search Select Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(FaIconComponent), SearchSelectFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-search-select-field',
              component: SearchSelectFieldComponent,
            },
          ],
        }),
        FormlySelectModule,
        FormlyTestingComponentsModule,
        NgSelectModule,
        ReactiveFormsModule,
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
          type: 'ish-search-select-field',
          props: {
            label: 'test-label',
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
    expect(element.querySelector('ish-search-select-field > .ng-select-container > ng-select')).toBeTruthy();
  });
});
