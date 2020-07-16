import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { LineItemListComponent } from 'ish-shared/components/basket/line-item-list/line-item-list.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';

import { CheckoutReviewComponent } from './checkout-review.component';

describe('Checkout Review Component', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketApprovalInfoComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(CheckboxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
        MockComponent(ModalDialogLinkComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit an event if t&c checkbox is checked', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();
    component.form.get('termsAndConditions').setValue('true');
    component.submitOrder();
    verify(emitter.emit()).once();
  });

  it('should not emit an event if t&c checkbox is empty', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();
    component.submitOrder();
    verify(emitter.emit()).never();
  });

  it('should display a message if an error occurs', () => {
    component.error = { status: 400, error: 'Bad request' } as HttpError;
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should display an approval required link if necessary', () => {
    component.basket.approval = {} as BasketApproval;
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-approval-info')).toBeTruthy();
  });
});
