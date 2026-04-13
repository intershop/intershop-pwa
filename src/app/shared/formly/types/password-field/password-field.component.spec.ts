import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { EXTRALARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { PasswordFieldComponent } from './password-field.component';

describe('Password Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn((query: string) => ({
        media: query,
      })),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-password-field',
              component: PasswordFieldComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
        PasswordFieldComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: EXTRALARGE_BREAKPOINT_WIDTH, useValue: 1400 }],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'password',
          type: 'ish-password-field',
          props: {
            required: true,
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        displayValue: 'testValue',
      },
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
    expect(element.querySelector('ish-password-field')).toBeTruthy();
  });
});
