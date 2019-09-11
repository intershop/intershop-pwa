import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PipesModule } from 'ish-core/pipes.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketCostSummaryComponent } from 'ish-shared/basket/components/basket-cost-summary/basket-cost-summary.component';
import { BasketPromotionCodeComponent } from 'ish-shared/basket/components/basket-promotion-code/basket-promotion-code.component';
import { LineItemListComponent } from 'ish-shared/basket/components/line-item-list/line-item-list.component';
import { ContentIncludeContainerComponent } from 'ish-shared/cms/containers/content-include/content-include.container';
import { ErrorMessageComponent } from 'ish-shared/common/components/error-message/error-message.component';
import { ModalDialogLinkComponent } from 'ish-shared/common/components/modal-dialog-link/modal-dialog-link.component';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { LazyBasketAddToQuoteComponent } from '../../../../extensions/quoting/exports/basket/components/lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';

import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketPromotionCodeComponent),
        MockComponent(ContentIncludeContainerComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyBasketAddToQuoteComponent),
        MockComponent(LineItemListComponent),
        MockComponent(ModalDialogLinkComponent),
        ShoppingBasketComponent,
      ],
      imports: [FormsSharedModule, PipesModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
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
    component.error = { status: 404 } as HttpError;
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });
});
