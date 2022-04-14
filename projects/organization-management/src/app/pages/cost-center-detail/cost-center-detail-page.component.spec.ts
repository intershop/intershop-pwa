import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { CostCenterBudgetComponent } from '../../components/cost-center-budget/cost-center-budget.component';
import { CostCenterUsersListComponent } from '../../components/cost-center-users-list/cost-center-users-list.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterDetailPageComponent } from './cost-center-detail-page.component';

describe('Cost Center Detail Page Component', () => {
  let component: CostCenterDetailPageComponent;
  let fixture: ComponentFixture<CostCenterDetailPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let organizationManagementFacade: OrganizationManagementFacade;

  const costCenter = {
    costCenterId: '100400',
    name: 'Headquarter',
    budget: { value: 500, currency: 'USD' },
    budgetPeriod: 'monthly',
    spentBudget: { value: 200, currency: 'USD' },
    costCenterOwner: {
      login: 'jlink@test.intershop.de',
      firstName: 'Jack',
      lastName: 'Link',
      email: 'jlink@test.intershop.de',
    },
  } as CostCenter;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    organizationManagementFacade = mock(OrganizationManagementFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        CostCenterDetailPageComponent,
        MockComponent(CostCenterBudgetComponent),
        MockComponent(CostCenterUsersListComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(OrderListComponent),
        MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
      ],
    }).compileComponents();

    when(organizationManagementFacade.selectedCostCenter$).thenReturn(of(costCenter));
    when(accountFacade.user$).thenReturn(of({ login: 'bboldner@test.intershop.de' } as User));
    when(organizationManagementFacade.isCostCenterEditable(anything())).thenReturn(of(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the cost center details when created', () => {
    fixture.detectChanges();
    expect(element.querySelector('dl').textContent.replace(/^\s*[\r\n]*/gm, '')).toMatchInlineSnapshot(
      `"account.costcenter.id.label 100400 account.costcenter.name.labelHeadquarteraccount.costcenter.manager.label Jack Link account.budget.labelUSD 500account.budget.already_spent.labelUSD 200"`
    );
    expect(element.querySelector('[data-testing-id=edit-cost-center]')).toBeTruthy();
  });

  it('should not display the order list if the current user in not the cost center manager', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list')).toBeFalsy();
  });

  it('should display the order list if the current user in the cost center manager', () => {
    when(accountFacade.user$).thenReturn(of({ login: 'jlink@test.intershop.de' } as User));

    fixture.detectChanges();
    expect(element.querySelector('ish-order-list')).toBeTruthy();
  });

  it('should display the user budget list when created', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-cost-center-users-list')).toBeTruthy();
  });
});
