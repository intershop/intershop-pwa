import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { LazyBudgetInfoComponent } from 'organization-management';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { CostCenter, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { Requisition } from '../../../models/requisition/requisition.model';
import { BudgetBarComponent } from '../budget-bar/budget-bar.component';

import { RequisitionCostCenterApprovalComponent } from './requisition-cost-center-approval.component';

describe('Requisition Cost Center Approval Component', () => {
  let component: RequisitionCostCenterApprovalComponent;
  let fixture: ComponentFixture<RequisitionCostCenterApprovalComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(BudgetBarComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LazyBudgetInfoComponent),
        PricePipe,
        RequisitionCostCenterApprovalComponent,
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();

    when(accountFacade.userEmail$).thenReturn(of('jlink@test.intershop.de'));
  });

  beforeEach(() => {
    const translate = TestBed.inject(TranslateService);
    translate.use('en');

    fixture = TestBed.createComponent(RequisitionCostCenterApprovalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.requisition = {
      id: 'testUUDI',
      requisitionNo: '0001',
      orderNo: '10001',
      approval: {
        statusCode: 'APPROVED',
        approvers: [{ firstName: 'Bernhard', lastName: 'Boldner', email: 'bboldner@test.intershop.de' }],
        approvalDate: 76543627,
        costCenterApproval: {
          approvers: [{ email: 'jlink@test.intershop.de' }],
          costCenter: {
            costCenterOwner: { email: 'jlink@test.intershop.de' },
            costCenterId: '100450',
            name: 'Headquarter',
            budgetPeriod: 'weekly',
            budget: { currency: 'USD', value: 3000, type: 'Money' },
            spentBudget: { currency: 'USD', value: 300, type: 'Money' },
          } as CostCenter,
        },
      },
      email: 'pmiller@test.intershop.de',
      user: { firstName: 'Patricia', lastName: 'Miller' },
      totals: {
        total: { gross: 2000, net: 1800, currency: 'USD' },
      } as BasketTotal,
    } as Requisition;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display infobox if the cost center data are given', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('ish-info-box')).toBeTruthy();
  });

  it('should not display infobox if there are no cost center data', () => {
    component.requisition.approval.costCenterApproval.costCenter = undefined;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('ish-info-box')).toBeFalsy();
  });

  it('should not display infobox if the current user is not the approver of the cost center', () => {
    when(accountFacade.userEmail$).thenReturn(of('bboldner@test.intershop.de'));

    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('ish-info-box')).toBeFalsy();
  });

  it('should display cost center budget information if created', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.textContent.replace(/^\s*[\r\n]*/gm, '')).toMatchInlineSnapshot(
      `"approval.detailspage.costcenter.approval.heading approval.detailspage.cost_center.label100450 Headquarterapproval.detailspage.costcenter.budget.label $3,000.00 account.budget.already_spent.label $300.00 (10%) "`
    );
  });

  it('should display cost center buyer budget information if there are buyer data', () => {
    component.requisition.approval.costCenterApproval.costCenter.buyers = [
      {
        email: 'pmiller@test.intershop.de',
        budgetPeriod: 'monthly',
        budget: { currency: 'USD', value: 4000, type: 'Money' },
        spentBudget: { currency: 'USD', value: 200, type: 'Money' },
      } as CostCenterBuyer,
    ];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(
      element.querySelector('[data-testing-id="cost-center-buyer-budget"]').textContent.replace(/^\s*[\r\n]*/gm, '')
    ).toMatchInlineSnapshot(
      `"approval.detailspage.buyer.budget.label $4,000.00 account.budget.already_spent.label $200.00 (5%) "`
    );
  });
});
