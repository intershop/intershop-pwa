import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { UserBudget } from '../../../models/user-budget/user-budget.model';

import { UserDetailBudgetComponent } from './user-detail-budget.component';

describe('User Detail Budget Component', () => {
  let component: UserDetailBudgetComponent;
  let fixture: ComponentFixture<UserDetailBudgetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [
        MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`),
        UserDetailBudgetComponent,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailBudgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.budget = {
      orderSpentLimit: {
        value: 100,
        currency: 'USD',
        type: 'Money',
      },
      budget: {
        value: 5000,
        currency: 'USD',
        type: 'Money',
      },
      budgetPeriod: 'monthly',
      remainingBudget: {
        value: 2500,
        currency: 'USD',
        type: 'Money',
      },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the configured order spend limit and budget when rendering', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-spend-limit-field]')?.textContent).toContain('USD 100');
    expect(element.querySelector('[data-testing-id=budget-field]')?.textContent).toContain('USD 5000');
  });

  it('should display unlimited when no order spend limit and budget are set', () => {
    component.budget = { budgetPeriod: 'monthly' } as UserBudget;
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-spend-limit-field]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=budget-field]')).toBeFalsy();
    expect(element.querySelectorAll('dd')).toHaveLength(2);
    element.querySelectorAll('dd').forEach(dd => expect(dd.textContent).toContain('account.budget.unlimited'));
  });

  it('should display edit budget link when rendering', () => {
    fixture.detectChanges();

    const link = element.querySelector<HTMLAnchorElement>('[data-testing-id=edit-budget]');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('routerlink')).toEqual('budget');
    expect(link?.title).toEqual('account.profile.update.link');
    expect(link?.getAttribute('aria-label')).toEqual('account.profile.update.link');
  });
});
