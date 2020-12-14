import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

import { ApprovalWidgetComponent } from './approval-widget.component';

describe('Approval Widget Component', () => {
  let component: ApprovalWidgetComponent;
  let fixture: ComponentFixture<ApprovalWidgetComponent>;
  let element: HTMLElement;

  let requisitionManagementFacade: RequisitionManagementFacade;

  const requisitions = [
    {
      id: '4711',
      requisitionNo: '4712',
      approval: {
        status: 'Approval Pending',
        statusCode: 'pending',
        customerApprovers: [
          { firstName: 'Jack', lastName: 'Link' },
          { firstName: 'Bernhhard', lastName: 'Boldner' },
        ],
      },
      user: { firstName: 'Patricia', lastName: 'Miller' },
      totals: {
        total: {
          type: 'PriceItem',
          gross: 1000,
          net: 750,
          currency: 'USD',
        },
      },
      creationDate: 24324321,
      lineItemCount: 2,
      lineItems: undefined,
    } as Requisition,
    {
      id: '4712',
      requisitionNo: '4713',
      approval: {
        status: 'Approval Pending',
        statusCode: 'pending',
        customerApprovers: [
          { firstName: 'Jack', lastName: 'Link' },
          { firstName: 'Bernhhard', lastName: 'Boldner' },
        ],
      },
      user: { firstName: 'Patricia', lastName: 'Miller' },
      totals: {
        total: {
          type: 'PriceItem',
          gross: 1000,
          net: 750,
          currency: 'USD',
        },
      },
      creationDate: 24324321,
      lineItemCount: 2,
      lineItems: undefined,
    } as Requisition,
  ];

  beforeEach(async () => {
    requisitionManagementFacade = mock(RequisitionManagementFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        ApprovalWidgetComponent,
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
        MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`),
      ],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(requisitionManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(requisitionManagementFacade.requisitions$('approver', 'PENDING')).thenReturn(of(requisitions));
    when(requisitionManagementFacade.requisitionsLoading$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if approvals loading', () => {
    when(requisitionManagementFacade.requisitionsLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display right amount of approvals', () => {
    fixture.detectChanges();
    const pendingCounter = element.querySelector('[data-testing-id="pending-counter"]');
    expect(pendingCounter.textContent.trim()).toEqual('2');
  });

  it('should display right sum of approval order amounts', () => {
    fixture.detectChanges();
    const pendingAmountSum = element.querySelector('[data-testing-id="pending-amount-sum"]');
    expect(pendingAmountSum.textContent.trim()).toContain('2000');
  });
});
