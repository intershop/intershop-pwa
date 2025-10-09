import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, objectContaining, verify, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InPlaceEditComponent } from 'ish-shared/components/common/in-place-edit/in-place-edit.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';
import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

describe('Account Order Template Detail Page Component', () => {
  let component: AccountOrderTemplateDetailPageComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailPageComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;
  const initial = {
    title: 'Order Template',
    items: [{ sku: '123', desiredQuantity: { value: 1 } }],
    itemsCount: 1,
  };

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.currentOrderTemplateOutOfStockItems$).thenReturn(of([]));
    when(orderTemplatesFacade.currentOrderTemplate$).thenReturn(of(initial as OrderTemplate));

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountOrderTemplateDetailPageComponent,
        InPlaceEditComponent,
        MockComponent(AccountOrderTemplateDetailLineItemComponent),
        MockComponent(ErrorMessageComponent),
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

  describe('order template without items', () => {
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
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-error-message",
          "ish-in-place-edit",
        ]
      `);
    });
  });

  describe('order template with item', () => {
    it('should display line item elements when rendering template with item', () => {
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-error-message",
          "ish-in-place-edit",
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
  });

  describe('order template name inline editing', () => {
    it('should call facade.updateOrderTemplate when in-place-edit emits edited', () => {
      fixture.detectChanges();
      component.model.title = 'New Title';

      const ipedeDE = fixture.debugElement.query(By.directive(InPlaceEditComponent));
      ipedeDE.triggerEventHandler('edited', undefined);

      verify(
        orderTemplatesFacade.updateOrderTemplate(
          objectContaining({
            title: 'New Title',
          })
        )
      ).once();
    });

    it('should not call updateOrderTemplate when title is unchanged', () => {
      fixture.detectChanges();
      component.model.title = initial.title;

      const ipedeDE = fixture.debugElement.query(By.directive(InPlaceEditComponent));
      ipedeDE.triggerEventHandler('edited', undefined);

      verify(orderTemplatesFacade.updateOrderTemplate(anything())).never();
    });

    it('should reset title when in-place-edit emits aborted', () => {
      fixture.detectChanges();
      component.model.title = 'Some Other';
      expect(component.model.title).toBe('Some Other');

      const ipedeDE = fixture.debugElement.query(By.directive(InPlaceEditComponent));
      ipedeDE.triggerEventHandler('aborted', undefined);

      expect(component.model.title).toBe(initial.title);
      verify(orderTemplatesFacade.updateOrderTemplate(anything())).never();
    });
  });
});
