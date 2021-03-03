import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { RegistrationTacFieldComponent } from './registration-tac-field.component';

describe('Registration Tac Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'tac', component: RegistrationTacFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent(ValidationMessageComponent),
        MockDirective(ServerHtmlDirective),
        RegistrationTacFieldComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          key: 'tac',
          type: 'tac',
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
    expect(element.querySelector('ish-registration-tac-field')).toBeTruthy();
  });

  it('should render a checkbox after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input.form-check-input[type="checkbox"]')).toBeTruthy();
  });
});
