import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { BasketPromotionCodeComponent } from 'ish-shared/components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { LineItemListComponent } from 'ish-shared/components/basket/line-item-list/line-item-list.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { LazyBasketCreateOrderTemplateComponent } from '../../../extensions/order-templates/exports/basket/lazy-basket-create-order-template/lazy-basket-create-order-template.component';
import { LazyBasketAddToQuoteComponent } from '../../../extensions/quoting/exports/basket/lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';

import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketInfoComponent),
        MockComponent(BasketPromotionCodeComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyBasketAddToQuoteComponent),
        MockComponent(LazyBasketCreateOrderTemplateComponent),
        MockComponent(LineItemListComponent),
        MockComponent(ModalDialogLinkComponent),
        ShoppingBasketComponent,
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw deleteItem event when onDeleteItem is triggered.', done => {
    component.deleteItem.subscribe(firedItem => {
      expect(firedItem).toBe('4712');
      done();
    });

    component.onDeleteItem('4712');
  });

  it('should throw update item event when onUpdateItem is triggered.', done => {
    const payload = { itemId: 'IID', quantity: 1 };

    component.updateItem.subscribe(firedItem => {
      expect(firedItem).toBe(payload);
      done();
    });

    component.onUpdateItem(payload);
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = makeHttpError({ status: 404 });
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });
});
