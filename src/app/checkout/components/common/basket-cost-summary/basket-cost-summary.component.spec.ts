import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { BasketCostSummaryComponent } from './basket-cost-summary.component';

describe('Basket Cost Summary Component', () => {
  let component: BasketCostSummaryComponent;
  let fixture: ComponentFixture<BasketCostSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), PopoverModule.forRoot(), PipesModule],
      declarations: [BasketCostSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCostSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.totals = BasketMockData.getTotals();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display estimated prices if estimated flag is not set', () => {
    fixture.detectChanges();
    expect(element.querySelector('.total-price span').innerHTML).toEqual('checkout.order.total_cost.label');
  });
  it('should display estimated prices if estimated flag is set', () => {
    component.isEstimated = true;
    fixture.detectChanges();
    expect(element.querySelector('.total-price span').innerHTML).toEqual('checkout.cart.estimated_total.label');
  });
});
