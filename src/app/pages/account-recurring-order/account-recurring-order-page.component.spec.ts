import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { SwitchComponent } from 'ish-shared/components/common/switch/switch.component';
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
      of({ id: '4711', user: { companyName: 'company' } } as RecurringOrder)
    );

    await TestBed.configureTestingModule({
      declarations: [
        AccountRecurringOrderPageComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketShippingMethodComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(OrderRecurrenceComponent),
        MockComponent(SwitchComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
      ],
      imports: [TranslateModule.forRoot()],
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
});
