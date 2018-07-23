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
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.ngOnChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set estimated flag to false if invoice address, shipping address and shipping method are set', () => {
    component.ngOnChanges();
    expect(component.estimated).toBeFalsy();
  });

  it('should set estimated flag to true if there is no invoice address', () => {
    component.basket.invoiceToAddress = undefined;
    component.ngOnChanges();
    expect(component.estimated).toBeTruthy();
  });

  it('should set estimated flag to true if there is no shipping address', () => {
    component.basket.commonShipToAddress = undefined;
    component.ngOnChanges();
    expect(component.estimated).toBeTruthy();
  });

  it('should set estimated flag to true if there is no shipping method', () => {
    component.basket.commonShippingMethod = undefined;
    component.ngOnChanges();
    expect(component.estimated).toBeTruthy();
  });
});
