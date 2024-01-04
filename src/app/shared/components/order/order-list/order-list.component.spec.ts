import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Order } from 'ish-core/models/order/order.model';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrderListComponent } from './order-list.component';

describe('Order List Component', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let element: HTMLElement;
  const orders = [
    { id: '00123', documentNo: '123', totals: {} },
    { id: '00124', documentNo: '124', totals: {} },
  ] as Order[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdkTableModule, TranslateModule.forRoot()],
      declarations: [MockComponent(AddressComponent), MockComponent(LoadingComponent), OrderListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list with default text if there are no orders as component orders input', () => {
    component.orders = [];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
    expect(component.noOrdersMessageKey).toBe('account.orderlist.no_orders_message');
  });

  it('should display loading overlay if orders are loading', () => {
    component.loading = true;
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display a list with address if requested', () => {
    component.orders = orders;
    component.columnsToDisplay = ['destination'];
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

  it('should not display addresses if only creationDate is required to show', () => {
    component.orders = orders;
    component.columnsToDisplay = ['creationDate'];
    fixture.detectChanges();

    expect(element.querySelector('ish-address')).toBeFalsy();
  });
});
