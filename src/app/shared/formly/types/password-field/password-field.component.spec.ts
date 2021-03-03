import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { PasswordFieldComponent } from './password-field.component';

describe('Password Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'password', component: PasswordFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'password',
          type: 'password',
        },
      ],
      model: { password: '' },
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
    expect(element.querySelector('ish-password-field')).toBeTruthy();
  });
  it('should be invalid if an incorrect email is entered', () => {
    fixture.detectChanges();
    component.form.get('password').setValue('@');
    fixture.detectChanges();
    expect(component.form.get('password').valid).toBeFalsy();
  });
});
