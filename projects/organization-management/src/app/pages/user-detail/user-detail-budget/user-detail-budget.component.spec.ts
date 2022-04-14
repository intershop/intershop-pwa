import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { UserDetailBudgetComponent } from './user-detail-budget.component';

describe('User Detail Budget Component', () => {
  let component: UserDetailBudgetComponent;
  let fixture: ComponentFixture<UserDetailBudgetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`),
        UserDetailBudgetComponent,
      ],
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

  it('should display budget when rendering', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=user-budget]')).toMatchInlineSnapshot(`
      <div data-testing-id="user-budget" class="col-md-12">
        <dl class="row dl-horizontal dl-separator">
          <dt class="col-md-4">account.user.new.order_spend_limit.label</dt>
          <dd data-testing-id="order-spend-limit-field" class="col-md-8">USD 100</dd>
          <dt class="col-md-4">account.budget.label</dt>
          <dd data-testing-id="budget-field" class="col-md-8">USD 5000</dd>
        </dl>
      </div>
    `);
  });

  it('should display edit budget link when rendering', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=edit-budget]')).toMatchInlineSnapshot(`
      <a
        routerlink="budget"
        data-testing-id="edit-budget"
        class="btn-tool"
        title="account.profile.update.link"
        ><fa-icon ng-reflect-icon="fas,pencil-alt"></fa-icon
      ></a>
    `);
  });
});
