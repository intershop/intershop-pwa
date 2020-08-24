import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { Requisition } from '../../models/requisition/requisition.model';
import { BudgetBarComponent } from '../budget-bar/budget-bar.component';

import { RequisitionBuyerApprovalComponent } from './requisition-buyer-approval.component';

describe('Requisition Buyer Approval Component', () => {
  let component: RequisitionBuyerApprovalComponent;
  let fixture: ComponentFixture<RequisitionBuyerApprovalComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(BudgetBarComponent),
        MockComponent(InfoBoxComponent),
        PricePipe,
        RequisitionBuyerApprovalComponent,
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }) // tslint:disable-next-line: no-any
      .configureCompiler({ preserveWhitespaces: true } as any)
      .compileComponents();
  }));

  beforeEach(() => {
    const translate = TestBed.inject(TranslateService);
    translate.use('en');

    fixture = TestBed.createComponent(RequisitionBuyerApprovalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.requisition = {
      id: 'testUUDI',
      requisitionNo: '0001',
      orderNo: '10001',
      approval: {
        statusCode: 'approved',
        approver: { firstName: 'Bernhard', lastName: 'Boldner' },
        approvalDate: 76543627,
      },
      user: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
      userBudgets: {
        budgetPeriod: 'weekly',
        orderSpentLimit: { currency: 'USD', value: 500, type: 'Money' },
        spentBudget: { currency: 'USD', value: 300, type: 'Money' },
        budget: { currency: 'USD', value: 3000, type: 'Money' },
      },
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

  it('should display budget information if created', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.textContent.replace(/^\s*[\r\n]*/gm, '')).toMatchInlineSnapshot(`
      "approval.detailspage.purchaser.label:
      Patricia Miller
      approval.detailspage.order_spend_limit.label
      $500.00
      approval.detailspage.budget.type.weekly.label
      $3,000.00
      approval.detailspage.budget.already_spent.label
      $300.00 (10%)
      approval.detailspage.budget.left.label
      $2,700.00 (90%)
      "
    `);
  });

  it('should display budget including this order information if approval status pending', () => {
    component.requisition.approval.statusCode = 'pending';
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.textContent.replace(/^\s*[\r\n]*/gm, '')).toMatchInlineSnapshot(`
      "approval.detailspage.purchaser.label:
      Patricia Miller
      approval.detailspage.order_spend_limit.label
      $500.00
      approval.detailspage.budget.type.weekly.label
      $3,000.00
      approval.detailspage.budget.already_spent.label
      $300.00 (10%)
      approval.detailspage.budget.including_order.label
      $2,300.00 (77%)
      "
    `);
  });
});
