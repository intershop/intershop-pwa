import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { AccountRecurringOrdersPageComponent } from './account-recurring-orders-page.component';
import { RecurringOrderListComponent } from './recurring-order-list/recurring-order-list.component';

describe('Account Recurring Orders Page Component', () => {
  let component: AccountRecurringOrdersPageComponent;
  let fixture: ComponentFixture<AccountRecurringOrdersPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.recurringOrdersContext$).thenReturn(of('MY'));
    when(accountFacade.recurringOrders$()).thenReturn(of([{ id: '4711' } as RecurringOrder]));

    await TestBed.configureTestingModule({
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_ORDERS'),
        NgbNavModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        AccountRecurringOrdersPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(RecurringOrderListComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRecurringOrdersPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
