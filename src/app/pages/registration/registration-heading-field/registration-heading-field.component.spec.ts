import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { RegistrationHeadingFieldComponent } from './registration-heading-field.component';

describe('Registration Heading Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockPipe(TranslatePipe), RegistrationHeadingFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'heading', component: RegistrationHeadingFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          type: 'heading',
          templateOptions: {
            headingSize: 'h1',
            heading: 'heading',
            subHeading: 'subHeading',
          },
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
    expect(element.querySelector('ish-registration-heading-field')).toBeTruthy();
  });
});
