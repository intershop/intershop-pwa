import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, objectContaining, verify, when } from 'ts-mockito';

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
  let initial: OrderTemplate;

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.currentOrderTemplateOutOfStockItems$).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountOrderTemplateDetailPageComponent,
        MockComponent(AccountOrderTemplateDetailLineItemComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
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
    initial = {
      title: 'Order Template',
      items: [{ sku: '123', desiredQuantity: { value: 1 } }],
      itemsCount: 1,
    } as OrderTemplate;

    when(orderTemplatesFacade.currentOrderTemplate$).thenReturn(of(initial));
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
        [
          "ish-error-message",
          "fa-icon",
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
        [
          "ish-error-message",
          "fa-icon",
          "ish-account-order-template-detail-line-item",
          "ish-product-add-to-basket",
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

    it('should set the title of the order template', () => {
      fixture.detectChanges();

      expect(component.titleControl.value).toEqual('Order Template');
    });

    it('should display title input when edit mode is triggered', async () => {
      component.startEditTitle();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(element.querySelector('[data-testing-id="order-template-title-input"]')).toBeTruthy();
    });

    it('should cancel editing and reset titleControl on cancel', async () => {
      component.startEditTitle();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      component.titleControl.setValue('Changed');
      const cancelButton: HTMLElement = element.querySelector('[data-testing-id="order-template-title-cancel"]');
      cancelButton.click();
      fixture.detectChanges();

      expect(component.editingTitle).toBeFalse();
      expect(component.titleControl.value).toEqual('Order Template');
    });

    it('should dispatch updateOrderTemplate on save (direct)', () => {
      fixture.detectChanges();

      component.startEditTitle();

      component.titleControl.setValue('New Title');

      component.saveTitle();

      verify(orderTemplatesFacade.updateOrderTemplate(anything())).once();
      verify(
        orderTemplatesFacade.updateOrderTemplate(
          objectContaining({
            title: 'New Title',
            items: initial.items,
            itemsCount: initial.itemsCount,
          })
        )
      ).once();

      expect(component.editingTitle).toBeFalse();
    });
  });
});
