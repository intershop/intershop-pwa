import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { RecurringOrderListComponent } from './recurring-order-list.component';

describe('Recurring Order List Component', () => {
  let component: RecurringOrderListComponent;
  let fixture: ComponentFixture<RecurringOrderListComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  const recurringOrders = [
    {
      id: '123',
      documentNo: '0000046',
      active: true,
      expired: false,
      creationDate: '74543627',
      user: { firstName: 'Patricia', lastName: 'Miller' },
      recurrence: {
        interval: 'P1D',
        startDate: '74543627',
        endDate: '77543627',
        repetitions: 3,
      },
      lastOrderDate: '74543627',
      nextOrderDate: '75543627',
      totals: {},
    },
    {
      id: '124',
      documentNo: '0000045',
      active: true,
      expired: false,
      creationDate: '74543627',
      user: { firstName: 'Bernhard', lastName: 'Boldner' },
      recurrence: {
        interval: 'P1D',
        startDate: '74543627',
        endDate: '77543627',
        repetitions: 3,
      },
      lastOrderDate: '75543627',
      nextOrderDate: '76543627',
      totals: {},
    },
  ] as RecurringOrder[];

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      imports: [CdkTableModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(ModalDialogComponent), MockPipe(DatePipe), RecurringOrderListComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringOrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no requisitions', () => {
    component.recurringOrders = [];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });

  it('should display a list of recurring orders if there are recurring orders', () => {
    component.recurringOrders = recurringOrders;
    component.columnsToDisplay = ['recurringOrderNo', 'creationDate'];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=recurringOrder-list]')).toBeTruthy();
    expect(element.querySelectorAll('[data-testing-id=recurringOrder-list] td')).toHaveLength(4);
  });

  it('should display no table columns if nothing is configured', () => {
    component.recurringOrders = recurringOrders;
    component.columnsToDisplay = [];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-recurringOrder-no]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-creation-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-frequency]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-last-order-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-next-order-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-buyer]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-order-total]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-order-actions]')).toBeFalsy();
  });

  it('should display table columns if they are configured', () => {
    component.recurringOrders = recurringOrders;
    component.columnsToDisplay = [
      'recurringOrderNo',
      'creationDate',
      'frequency',
      'lastOrderDate',
      'nextOrderDate',
      'buyer',
      'orderTotal',
      'actions',
    ];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-recurringOrder-no]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-creation-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-frequency]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-last-order-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-next-order-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-buyer]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-order-total]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-order-actions]')).toBeTruthy();
  });
});
