import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';
import { LazyBuyersSelectComponent } from 'organization-management';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { AccountOrderSelectBuyerFieldComponent } from './account-order-select-buyer-field.component';

describe('Account Order Select Buyer Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS'),
        FormlyModule.forRoot({
          types: [{ name: 'select-buyer', component: AccountOrderSelectBuyerFieldComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [AccountOrderSelectBuyerFieldComponent, MockComponent(LazyBuyersSelectComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      form: new FormGroup({}),
      fields: [
        {
          key: 'select-buyer',
          type: 'select-buyer',
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
    expect(element.querySelector('ish-account-order-select-buyer-field')).toBeTruthy();
  });

  it('should render a select box after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=buyers-select]')).toBeTruthy();
  });
});
