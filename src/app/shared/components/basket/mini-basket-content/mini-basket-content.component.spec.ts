import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

import { MiniBasketContentComponent } from './mini-basket-content.component';

describe('Mini Basket Content Component', () => {
  let component: MiniBasketContentComponent;
  let fixture: ComponentFixture<MiniBasketContentComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    const lineItem = BasketMockData.getBasketItem();
    when(checkoutFacade.basketLineItems$).thenReturn(of([lineItem, lineItem, lineItem]));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MiniBasketContentComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductNameComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBasketContentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product rows if expanded', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-row')).toHaveLength(3);
  });

  it('should render product image component on expanded component', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toHaveLength(3);
  });
});
