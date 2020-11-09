import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { LineItemDescriptionComponent } from 'ish-shared/components/line-item/line-item-description/line-item-description.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToWishlistComponent } from '../../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { LineItemListComponent } from './line-item-list.component';

describe('Line Item List Component', () => {
  let component: LineItemListComponent;
  let fixture: ComponentFixture<LineItemListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(anything(), anything())).thenReturn(of({} as ProductView));

    await TestBed.configureTestingModule({
      declarations: [
        LineItemListComponent,
        MockComponent(BasketPromotionComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockComponent(LineItemDescriptionComponent),
        MockComponent(ProductImageComponent),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.lineItems = [BasketMockData.getBasketItem()];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render sub components if basket changes', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-line-item-description', 'ish-product-image']);
  });

  it('should throw deleteItem event when delete item is clicked', done => {
    let firedItem = '';
    component.deleteItem.subscribe(itemId => {
      firedItem = itemId;
      done();
    });

    component.onDeleteItem('4712');
    expect(firedItem).toBe('4712');
  });

  describe('editable', () => {
    beforeEach(() => {
      component.editable = true;
    });

    it('should render item quantity change input field if editable === true', () => {
      fixture.detectChanges();
      expect(element.querySelector('ish-input[controlname=quantity]')).toBeTruthy();
    });

    it('should not render item quantity change input field if editable === false', () => {
      component.editable = false;
      fixture.detectChanges();
      expect(element.querySelector('ish-input[controlname=quantity]')).not.toBeTruthy();
    });

    it('should render item delete button if editable === true', () => {
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,trash-alt"]')).toBeTruthy();
    });

    it('should not render item delete button if editable === false', () => {
      component.editable = false;
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,trash-alt"]')).toBeFalsy();
    });
  });

  describe('totals', () => {
    it('should render totals if set', () => {
      component.total = { value: 1 } as Price;
      fixture.detectChanges();
      expect(element.textContent).toContain('quote.items.total.label');
    });

    it('should not render totals if no line items present', () => {
      component.total = { value: 1 } as Price;
      component.lineItems = [];
      fixture.detectChanges();
      expect(element.textContent).not.toContain('quote.items.total.label');
    });
  });
});
