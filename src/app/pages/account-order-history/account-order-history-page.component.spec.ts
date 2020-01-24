import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';

describe('Account Order History Page Component', () => {
  let component: AccountOrderHistoryPageComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageComponent,
        MockComponent(LoadingComponent),
        MockComponent(OrderListComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

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
