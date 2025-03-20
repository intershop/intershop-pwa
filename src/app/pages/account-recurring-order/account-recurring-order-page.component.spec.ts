import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { SwitchComponent } from 'ish-shared/components/common/switch/switch.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

import { AccountRecurringOrderPageComponent } from './account-recurring-order-page.component';

describe('Account Recurring Order Page Component', () => {
  let component: AccountRecurringOrderPageComponent;
  let fixture: ComponentFixture<AccountRecurringOrderPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.customer$).thenReturn(of({ customerNo: 'OilCorp' } as Customer));
    when(accountFacade.selectedRecurringOrder$).thenReturn(
      of({
        id: '4711',
        documentNo: '12345678',
        customerNo: 'OilCorp',
        active: true,
        user: { companyName: 'company' },
        lineItems: [
          {
            id: 'test',
            productSKU: 'sku',
            quantity: { value: 3 },
          } as LineItem,
        ],
        approvalStatuses: [
          { approvalDate: 76543627, approver: { firstName: 'John', lastName: 'Doe' }, statusCode: 'APPROVED' },
        ],
      } as RecurringOrder)
    );

    await TestBed.configureTestingModule({
      declarations: [
        AccountRecurringOrderPageComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketShippingMethodComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
        MockComponent(OrderRecurrenceComponent),
        MockComponent(SwitchComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
      ],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'account/requisitions/buyer:RecurringOrderId', children: [] }]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRecurringOrderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered without errors if no recurring order is available', () => {
    component.recurringOrder$ = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render recurring order details for the given order', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-summary-info]')).toBeTruthy();
    expect(element.querySelectorAll('ish-info-box')).toHaveLength(6);
    expect(element.querySelector('ish-line-item-list')).toBeTruthy();
    expect(element.querySelector('ish-basket-cost-summary')).toBeTruthy();
    expect(element.querySelector('ish-order-recurrence')).toBeTruthy();
    expect(element.querySelector('ish-switch')).toBeTruthy();
  });

  it('should display a link to the requisition after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="requisiton-link"]')).toBeTruthy();
  });

  it('should display the home link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="home-link"]')).toBeTruthy();
  });

  it('should display the recurring order list link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="recurring-orders-link"]')).toBeTruthy();
  });
});
