import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { BudgetBarComponent } from './budget-bar.component';

describe('Budget Bar Component', () => {
  let component: BudgetBarComponent;
  let fixture: ComponentFixture<BudgetBarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BudgetBarComponent, PricePipe],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }) // tslint:disable-next-line: no-any
      .configureCompiler({ preserveWhitespaces: true } as any)
      .compileComponents();
  });

  beforeEach(() => {
    const translate = TestBed.inject(TranslateService);
    translate.use('en');

    fixture = TestBed.createComponent(BudgetBarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.budget = {
      type: 'Money',
      currency: 'USD',
      value: 500,
    };

    component.spentBudget = {
      type: 'Money',
      currency: 'USD',
      value: 700,
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything if there is no budget given', () => {
    component.budget = undefined;

    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display budget bar if there is a budget given', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="budget-bar-overflow">
        <div class="overflow-indicator" style="width: 71%" title="$500.00">
          <span class="overflow-display">71%</span>
        </div>
      </div>
      <div class="budget-bar">
        <div
          aria-hidden="true"
          class="budget-bar-used bg-danger"
          ng-reflect-ng-class="bg-danger"
          style="width: 140%"
          title="$700.00"
        >
          $700.00
        </div>
      </div>
    `);
  });

  it('should display the additional budget if given', () => {
    component.additionalAmount = {
      type: 'Money',
      currency: 'USD',
      value: 300,
    };

    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('.budget-bar-used-additional')).toMatchInlineSnapshot(`
      <div
        aria-hidden="true"
        class="budget-bar-used budget-bar-used-additional border-left bg-danger"
        role="progressbar"
        ng-reflect-ng-class="bg-danger"
        style="width: 30%"
        title="$300.00"
      >
        <span>$300.00</span>
      </div>
    `);
  });
});
