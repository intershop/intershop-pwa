import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrderListComponent } from './order-list.component';

describe('Order List Component', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  const orders = [
    { id: '00123', documentNo: '123', totals: {} },
    { id: '00124', documentNo: '124', totals: {} },
  ] as Order[];

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [CdkTableModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(AddressComponent),
        MockComponent(LoadingComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
        OrderListComponent,
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(accountFacade.orders$()).thenReturn(of(orders));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list with user related text if there are no orders from store', () => {
    when(accountFacade.orders$()).thenReturn(of([]));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
    expect(component.noOrdersMessageKey).toBe('account.orderlist.no_placed_orders_message');
  });

  it('should display empty list with default text if there are no orders as component orders input', () => {
    component.orders = [];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
    expect(component.noOrdersMessageKey).toBe('account.orderlist.no_orders_message');
  });

  it('should display loading overlay if orders are loading', () => {
    when(accountFacade.ordersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display a list if there are orders in store', () => {
    when(accountFacade.orders$()).thenReturn(of(orders));
    fixture.detectChanges();

    expect(element.querySelector('table.cdk-table')).toBeTruthy();
    expect(element.querySelectorAll('table tr.cdk-row')).toHaveLength(2);
    expect(element.querySelector('ish-address')).toBeTruthy();
  });

  it('should display a list if there are orders provided as input parameter', () => {
    component.orders = [
      { id: '00123', documentNo: '123', totals: {} },
      { id: '00124', documentNo: '124', totals: {} },
      { id: '00125', documentNo: '125', totals: {} },
    ] as Order[];
    fixture.detectChanges();

    expect(element.querySelector('table.cdk-table')).toBeTruthy();
    expect(element.querySelectorAll('table tr.cdk-row')).toHaveLength(3);
  });

  it('should display a certain number of items if maxItemsCount is set', () => {
    component.maxListItems = 1;
    fixture.detectChanges();

    expect(element.querySelectorAll('table tr.cdk-row')).toHaveLength(1);
  });

  it('should not display addresses if only creationDate is required to show', () => {
    when(accountFacade.orders$()).thenReturn(of(orders));
    component.columnsToDisplay = ['creationDate'];
    fixture.detectChanges();

    expect(element.querySelector('ish-address')).toBeFalsy();
  });
});
