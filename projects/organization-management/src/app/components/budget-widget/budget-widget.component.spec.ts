import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { Price } from 'ish-core/models/price/price.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { BudgetInfoComponent } from '../budget-info/budget-info.component';
import { UserBudgetComponent } from '../user-budget/user-budget.component';

import { BudgetWidgetComponent } from './budget-widget.component';

const budget = {
  orderSpentLimit: {
    currency: 'USD',
    value: 500,
  } as Price,
  remainingBudget: {
    currency: 'USD',
    value: 8110.13,
  } as Price,
  spentBudget: {
    currency: 'USD',
    value: 1889.87,
  } as Price,
  budget: {
    currency: 'USD',
    value: 10000,
  } as Price,
  budgetPeriod: 'monthly',
};

describe('Budget Widget Component', () => {
  let component: BudgetWidgetComponent;
  let fixture: ComponentFixture<BudgetWidgetComponent>;
  let element: HTMLElement;

  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        BudgetWidgetComponent,
        MockComponent(BudgetInfoComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
        MockComponent(UserBudgetComponent),
        MockDirective(AuthorizationToggleDirective),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(organizationManagementFacade.loggedInUserBudget$()).thenReturn(of(budget));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if budget is loading', () => {
    when(organizationManagementFacade.loggedInUserBudgetLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });
});
