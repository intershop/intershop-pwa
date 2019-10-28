import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { OrderListContainerComponent } from 'ish-shared/order/containers/order-list/order-list.container';

import { AccountOrderHistoryPageContainerComponent } from './account-order-history-page.container';

describe('Account Order History Page Container', () => {
  let component: AccountOrderHistoryPageContainerComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageContainerComponent,
        MockComponent(LoadingComponent),
        MockComponent(OrderListContainerComponent),
        MockComponent(ServerHtmlDirective),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderHistoryPageContainerComponent);
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
    expect(element.querySelector('ish-order-list-container')).toBeTruthy();
  });
});
