import { CurrencyPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BasketRebate } from '../../../../models/basket-rebate/basket-rebate.model';
import { Basket } from '../../../../models/basket/basket.model';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketCostSummaryComponent } from './basket-cost-summary.component';

describe('BasketCostSummaryComponent', () => {
  let component: BasketCostSummaryComponent;
  let fixture: ComponentFixture<BasketCostSummaryComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), PopoverModule.forRoot(), PipesModule],
        declarations: [BasketCostSummaryComponent],
        providers: [CurrencyPipe],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCostSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = {
      id: '4711',
      valueRebates: [
        {
          name: 'appliedRebate',
          amount: {
            value: 11.9,
            currencyMnemonic: 'USD',
          },
          rebateType: 'OrderValueOffDiscount',
        } as BasketRebate,
      ],
      itemSurchargeTotalsByType: [
        {
          name: 'surcharge',
          amount: {
            value: 595,
            currencyMnemonic: 'USD',
          },
          description: 'Surcharge for battery deposit',
          displayName: 'Battery Deposit Surcharge',
        },
      ],

      totals: {
        itemTotal: {
          value: 141796.98,
          currencyMnemonic: 'USD',
        },
        itemRebatesTotal: {
          value: 4446,
          currencyMnemonic: 'USD',
        },
        shippingTotal: {
          value: 87.06,
          currencyMnemonic: 'USD',
        },
        itemShippingRebatesTotal: {
          value: 0,
          currencyMnemonic: 'USD',
        },
        basketValueRebatesTotal: {
          value: 4457.9,
          currencyMnemonic: 'USD',
        },
        basketShippingRebatesTotal: {
          value: 0,
          currencyMnemonic: 'USD',
        },
        paymentCostsTotal: {
          value: 3.57,
          currencyMnemonic: 'USD',
        },
        taxTotal: {
          value: 22747.55,
          currencyMnemonic: 'USD',
        },
        basketTotal: {
          value: 142470.71,
          currencyMnemonic: 'USD',
        },
      },
    } as Basket;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.ngOnChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
