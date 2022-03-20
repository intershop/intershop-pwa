import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';

import { CostCenterBudgetComponent } from './cost-center-budget.component';

describe('Cost Center Budget Component', () => {
  let component: CostCenterBudgetComponent;
  let fixture: ComponentFixture<CostCenterBudgetComponent>;
  let element: HTMLElement;
  let basketChange: SimpleChanges;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      declarations: [CostCenterBudgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterBudgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.costCenter = {
      budget: {
        value: 5000,
        currency: 'USD',
        type: 'Money',
      },
      budgetPeriod: 'monthly',
      remainingBudget: {
        value: 3000,
        currency: 'USD',
        type: 'Money',
      },
      spentBudget: {
        value: 2000,
        currency: 'USD',
        type: 'Money',
      },
    } as CostCenter;

    basketChange = {
      costCenter: new SimpleChange(undefined, component.costCenter, false),
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display budget progress bar when rendering', () => {
    component.ngOnChanges(basketChange);
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div>
        <div placement="top" data-testing-id="cost-center-budget-popover" ng-reflect-placement="top">
          <div class="progress">
            <div role="progressbar" class="progress-bar" style="width: 40%">
              <span class="progress-display">40%</span>
            </div>
          </div>
        </div>
      </div>
    `);
  });
});
