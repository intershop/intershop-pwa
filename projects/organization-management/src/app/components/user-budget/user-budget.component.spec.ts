import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { UserBudgetComponent } from './user-budget.component';

describe('User Budget Component', () => {
  let component: UserBudgetComponent;
  let fixture: ComponentFixture<UserBudgetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`), UserBudgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBudgetComponent);
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
      spentBudget: {
        value: 2500,
        currency: 'USD',
        type: 'Money',
      },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display budget when rendering', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.textContent).toContain(
      'account.user.new.order_spend_limit.label USD 100 account.budget.labelUSD 5000account.budget.already_spent.labelUSD 250050%'
    );
  });

  it('should return 2500 used budget when remaining budget is 2500', () => {
    component.ngOnChanges();

    expect(component.usedBudget.value).toEqual(2500);
  });

  it('should display 50% for the used budget percentage', () => {
    component.ngOnChanges();

    expect(component.usedBudgetPercentage).toEqual(0.5);
  });

  it('should display 50% for the remaining budget', () => {
    component.ngOnChanges();

    expect(component.remainingBudgetPercentage).toEqual(0.5);
  });
});
