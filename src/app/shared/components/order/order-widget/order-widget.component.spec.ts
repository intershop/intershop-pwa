import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { OrderWidgetComponent } from './order-widget.component';

const roles = [
  {
    roleId: 'APP_B2B_ACCOUNT_OWNER',
    displayName: 'Blubber',
  },
];

const businessCustomer = {
  customerNo: '4711',
  isBusinessCustomer: true,
} as Customer;

describe('Order Widget Component', () => {
  let component: OrderWidgetComponent;
  let fixture: ComponentFixture<OrderWidgetComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(InfoBoxComponent), MockComponent(OrderListComponent), OrderWidgetComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(accountFacade.customer$).thenReturn(of(businessCustomer));
    when(accountFacade.roles$).thenReturn(of(roles));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
