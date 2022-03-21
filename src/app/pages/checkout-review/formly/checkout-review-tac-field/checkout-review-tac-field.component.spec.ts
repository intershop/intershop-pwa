import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { CheckoutReviewTacFieldComponent } from './checkout-review-tac-field.component';

describe('Checkout Review Tac Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-checkout-review-tac-field', component: CheckoutReviewTacFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [CheckoutReviewTacFieldComponent, MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          key: 'termsAndConditions',
          type: 'ish-checkout-review-tac-field',
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
    expect(element.querySelector('ish-checkout-review-tac-field')).toBeTruthy();
  });

  it('should render a checkbox after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[type="checkbox"]')).toBeTruthy();
  });
});
