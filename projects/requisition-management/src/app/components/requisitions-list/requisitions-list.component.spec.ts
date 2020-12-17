import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';

import { Requisition } from '../../models/requisition/requisition.model';

import { RequisitionsListComponent } from './requisitions-list.component';

describe('Requisitions List Component', () => {
  let component: RequisitionsListComponent;
  let fixture: ComponentFixture<RequisitionsListComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  const requisitions = [
    {
      id: '0123',
      requisitionNo: '0001',
      orderNo: '10001',
      approval: {
        approvalDate: 76543627,
      },
      user: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
      totals: {},
    },
    {
      id: '0124',
      requisitionNo: '0002',
      orderNo: '10002',
      approval: {
        approvalDate: 76543628,
      },
      user: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
      totals: {},
    },
  ] as Requisition[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdkTableModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockPipe(DatePipe), MockPipe(PricePipe), RequisitionsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', {
      'account.approvallist.items': { other: '# items' },
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no requisitions', () => {
    component.requisitions = [];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });

  it('should display a list of requisitions if there are requisitions', () => {
    component.requisitions = requisitions;
    component.columnsToDisplay = ['requisitionNo', 'orderTotal'];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=requisition-list]')).toBeTruthy();
    expect(element.querySelectorAll('[data-testing-id=requisition-list] td')).toHaveLength(4);
  });

  it('should display list counter if there are requisitions', () => {
    component.requisitions = requisitions;
    component.columnsToDisplay = ['requisitionNo', 'orderTotal'];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=list-counter]')).toBeTruthy();
  });

  it('should display no table columns if nothing is configured', () => {
    component.requisitions = requisitions;
    component.columnsToDisplay = [];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-requisition-no]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-order-no]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-creation-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-approver]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-buyer]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-approval-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-rejection-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-line-items]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-order-total]')).toBeFalsy();
  });

  it('should display table columns if they are configured', () => {
    component.requisitions = requisitions;
    component.columnsToDisplay = [
      'requisitionNo',
      'orderNo',
      'creationDate',
      'approver',
      'buyer',
      'approvalDate',
      'rejectionDate',
      'lineItems',
      'orderTotal',
    ];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-requisition-no]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-order-no]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-creation-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-approver]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-buyer]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-approval-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-rejection-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-line-items]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-order-total]')).toBeTruthy();
  });
});
