import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { CheckoutReceiptComponent } from './checkout-receipt.component';

describe('Checkout Receipt Component', () => {
  let component: CheckoutReceiptComponent;
  let fixture: ComponentFixture<CheckoutReceiptComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReceiptComponent,
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['basket'],
        }),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
