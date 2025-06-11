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

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../../shared/order-template-preferences-dialog/order-template-preferences-dialog.component';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';
import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

describe('Account Order Template Detail Page Component', () => {
  let component: AccountOrderTemplateDetailPageComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailPageComponent>;
  let facadeMock: OrderTemplatesFacade;
  let initial: OrderTemplate;
  let element: HTMLElement;

  beforeEach(async () => {
    facadeMock = mock(OrderTemplatesFacade);
    when(facadeMock.currentOrderTemplateOutOfStockItems$).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        AccountOrderTemplateDetailPageComponent,
        InPlaceEditComponent, // echtes Component, nicht gemockt!
        MockComponent(AccountOrderTemplateDetailLineItemComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(OrderTemplatePreferencesDialogComponent),
        MockComponent(ProductAddToBasketComponent),
        MockDirective(ProductContextDirective),
      ],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(facadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    initial = {
      title: 'Order Template',
      items: [{ sku: '123', desiredQuantity: { value: 1 } }],
      itemsCount: 1,
    } as OrderTemplate;

    when(facadeMock.currentOrderTemplate$).thenReturn(of(initial));

    fixture = TestBed.createComponent(AccountOrderTemplateDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display standard elements when template is empty', () => {
    when(facadeMock.currentOrderTemplate$).thenReturn(
      of({ title: 'Order Template', items: [], itemsCount: 0 } as OrderTemplate)
    );

    fixture = TestBed.createComponent(AccountOrderTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(findAllCustomElements(fixture.nativeElement)).toMatchInlineSnapshot(`
      [
        "ish-error-message",
        "ish-in-place-edit",
        "fa-icon",
      ]
  `);
  });

  it('should display line items and add-to-basket when items exist', () => {
    expect(findAllCustomElements(fixture.nativeElement)).toMatchInlineSnapshot(`
      [
        "ish-error-message",
        "ish-in-place-edit",
        "fa-icon",
        "ish-account-order-template-detail-line-item",
        "ish-product-add-to-basket",
      ]
    `);
  });

  it('should call facade.updateOrderTemplate when in-place-edit emits edited', () => {
    component.titleControl.setValue('New Title');
    fixture.detectChanges();

    const ipedeDE = fixture.debugElement.query(By.directive(InPlaceEditComponent));
    ipedeDE.triggerEventHandler('edited', undefined);
    fixture.detectChanges();

    verify(
      facadeMock.updateOrderTemplate(
        objectContaining({
          title: 'New Title',
          items: initial.items,
          itemsCount: initial.itemsCount,
        })
      )
    ).once();
  });

  it('should not call updateOrderTemplate when title is unchanged', () => {
    component.titleControl.setValue(initial.title);
    fixture.detectChanges();

    const ipedeDE = fixture.debugElement.query(By.directive(InPlaceEditComponent));
    ipedeDE.triggerEventHandler('edited', undefined);
    fixture.detectChanges();

    verify(facadeMock.updateOrderTemplate(anything())).never();
  });

  it('should reset titleControl when in-place-edit emits aborted', () => {
    component.titleControl.setValue('Some Other');
    fixture.detectChanges();
    expect(component.titleControl.value).toBe('Some Other');

    const ipedeDE = fixture.debugElement.query(By.directive(InPlaceEditComponent));
    ipedeDE.triggerEventHandler('aborted', undefined);
    fixture.detectChanges();

    expect(component.titleControl.value).toBe(initial.title);
    verify(facadeMock.updateOrderTemplate(anything())).never();
  });

  it('should not display out-of-stock warning by default', () => {
    expect(fixture.nativeElement.querySelector('[data-testing-id="out-of-stock-warning"]')).toBeFalsy();
  });

  it('should display out-of-stock warning when unavailable products exist', async () => {
    when(facadeMock.currentOrderTemplateOutOfStockItems$).thenReturn(of(['', '', '', '', '']));

    fixture = TestBed.createComponent(AccountOrderTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const warningEl = fixture.nativeElement.querySelector('[data-testing-id="out-of-stock-warning"]');
    expect(warningEl).toBeTruthy();
  });
});
