import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountRecurringOrdersPageComponent } from './account-recurring-orders-page.component';
import { RecurringOrderListComponent } from './recurring-order-list/recurring-order-list.component';

@Directive({
  selector: '[ishIsAuthorizedTo]',
  standalone: true,
})
class MockAuthorizationToggleDirective {
  @Input() set ishIsAuthorizedTo(permission: unknown) {
    void permission;
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  constructor(private templateRef: TemplateRef<unknown>, private viewContainerRef: ViewContainerRef) {}
}

describe('Account Recurring Orders Page Component', () => {
  let component: AccountRecurringOrdersPageComponent;
  let fixture: ComponentFixture<AccountRecurringOrdersPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    when(accountFacade.recurringOrdersContext$).thenReturn(of('MY'));
    when(accountFacade.recurringOrders$()).thenReturn(of([{ id: '4711' } as RecurringOrder]));
    when(accountFacade.recurringOrdersLoading$).thenReturn(of(false));
    when(accountFacade.recurringOrdersError$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      imports: [AccountRecurringOrdersPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }, provideRouter([])],
    })
      .overrideComponent(AccountRecurringOrdersPageComponent, {
        remove: {
          imports: [AuthorizationToggleDirective, ErrorMessageComponent, LoadingComponent, RecurringOrderListComponent],
        },
        add: {
          imports: [
            MockAuthorizationToggleDirective,
            MockComponent(ErrorMessageComponent),
            MockComponent(LoadingComponent),
            MockComponent(RecurringOrderListComponent),
          ],
        },
      })
      .compileComponents();
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

  it('should display loading overlay if recurring orders are loading', () => {
    when(accountFacade.recurringOrdersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display my tab as active if context is MY', () => {
    fixture.detectChanges();
    fixture.detectChanges();
    expect(element.querySelector('.nav-tabs .active')?.textContent).toContain('account.recurring_orders.tab_my');
  });

  it('should display admin tab as active if context is ADMIN', () => {
    when(accountFacade.recurringOrdersContext$).thenReturn(of('ADMIN'));
    fixture.detectChanges();
    fixture.detectChanges();
    expect(element.querySelector('.nav-tabs .active')?.textContent).toContain('account.recurring_orders.tab_all');
  });
});
