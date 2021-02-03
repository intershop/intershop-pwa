import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shell/header/product-name/product-name.component';

import { BasketValidationItemsComponent } from './basket-validation-items.component';

describe('Basket Validation Items Component', () => {
  let component: BasketValidationItemsComponent;
  let fixture: ComponentFixture<BasketValidationItemsComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        BasketValidationItemsComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketValidationItemsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything if there are no validation items', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display an validation line item if there is a validation item', () => {
    component.lineItems = [BasketMockData.getBasketItem()];
    when(shoppingFacade.product$(anything(), anything())).thenReturn(of({ sku: '4713' } as ProductView));

    fixture.detectChanges();

    expect(element.querySelector('.list-header')).toBeTruthy();
    expect(element.querySelector('.list-body')).toBeTruthy();
    expect(element.querySelector('.product-id').innerHTML).toContain('4713');
    expect(element.querySelector('[data-testing-id="delete-button"]')).toBeTruthy();
  });

  it('should emit deleteItem event if called', () => {
    const eventEmitter$ = spy(component.deleteItem);

    component.lineItems = [BasketMockData.getBasketItem()];
    fixture.detectChanges();

    component.onDeleteItem('4713');

    verify(eventEmitter$.emit('4713')).once();
  });
});
