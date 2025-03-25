import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { PagingComponent } from 'ish-shared/components/common/paging/paging.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';

describe('Account Order History Page Component', () => {
  let component: AccountOrderHistoryPageComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.orders$).thenReturn(of([]));
    when(accountFacade.isOrderManager$).thenReturn(of(true));

    await TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(OrderListComponent),
        MockComponent(PagingComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderHistoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list')).toBeTruthy();
  });
});
