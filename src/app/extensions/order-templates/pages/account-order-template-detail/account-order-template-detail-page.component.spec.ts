import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../../shared/order-template-preferences-dialog/order-template-preferences-dialog.component';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';
import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

describe('Account Order Template Detail Page Component', () => {
  let component: AccountOrderTemplateDetailPageComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailPageComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.currentOrderTemplateOutOfStockItems$).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountOrderTemplateDetailPageComponent,
        MockComponent(AccountOrderTemplateDetailLineItemComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(OrderTemplatePreferencesDialogComponent),
        MockComponent(ProductAddToBasketComponent),
        MockDirective(ProductContextDirective),
      ],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('template without items', () => {
    beforeEach(() => {
      when(orderTemplatesFacade.currentOrderTemplate$).thenReturn(
        of({
          title: 'Order Template',
          items: [],
          itemsCount: 0,
        } as OrderTemplate)
      );
    });

    it('should display standard elements when rendering empty template', () => {
      when(orderTemplatesFacade.currentOrderTemplate$).thenReturn(
        of({
          title: 'Order Template',
          items: [],
          itemsCount: 0,
        } as OrderTemplate)
      );
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
          Array [
            "ish-error-message",
            "ish-order-template-preferences-dialog",
          ]
        `);
    });
  });

  describe('template with item', () => {
    beforeEach(() => {
      when(orderTemplatesFacade.currentOrderTemplate$).thenReturn(
        of({
          title: 'Order Template',
          items: [{ sku: '123', desiredQuantity: { value: 1 } }],
          itemsCount: 1,
        } as OrderTemplate)
      );
    });

    it('should display line item elements when rendering template with item', () => {
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-error-message",
          "ish-account-order-template-detail-line-item",
          "ish-product-add-to-basket",
          "ish-order-template-preferences-dialog",
        ]
      `);
    });

    it('should not display out of stock warning by default', () => {
      fixture.detectChanges();

      expect(element.querySelector('[data-testing-id="out-of-stock-warning"]')).toBeFalsy();
    });

    it('should display out of stock warning when items are unavailable', () => {
      when(orderTemplatesFacade.currentOrderTemplateOutOfStockItems$).thenReturn(of(['123']));
      fixture.detectChanges();

      expect(element.querySelector('[data-testing-id="out-of-stock-warning"]')).toBeTruthy();
    });
  });
});
