import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

import { OrderTemplateWidgetComponent } from './order-template-widget.component';

describe('Order Template Widget Component', () => {
  let component: OrderTemplateWidgetComponent;
  let fixture: ComponentFixture<OrderTemplateWidgetComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;

  const orderTemplates = [
    {
      id: '1',
      title: 'order template',
      itemsCount: 2,
      items: [
        { sku: 'SKU1', id: '1', creationDate: 0, desiredQuantity: { value: 1 } },
        { sku: 'SKU2', id: '2', creationDate: 0, desiredQuantity: { value: 3 } },
      ],
    },
    {
      id: '2',
      title: 'order template 2',
      itemsCount: 1,
      items: [{ sku: 'SKU3', id: '3', creationDate: 0, desiredQuantity: { value: 2 } }],
    },
  ] as OrderTemplate[];

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.orderTemplatesWithDetails$(anything())).thenReturn(of(orderTemplates));
    when(orderTemplatesFacade.orderTemplateLoading$).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [RouterModule, TranslatePipe],
      declarations: [
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductAddToBasketComponent),
        MockDirective(ProductContextDirective),
        OrderTemplateWidgetComponent,
      ],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTemplateWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if order templates are loading', () => {
    when(orderTemplatesFacade.orderTemplateLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render order template list after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('.loading-container').textContent).toContain('order template');
    expect(element.querySelector('.loading-container').textContent).toContain('order template 2');
  });

  it('should render add to cart button for templates with items', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-product-add-to-basket')).toHaveLength(2);
  });

  it('should trigger loading of the details of the displayed order templates on init', () => {
    fixture.detectChanges();
    verify(orderTemplatesFacade.orderTemplatesWithDetails$(3)).once();
  });

  it('should map the order template items to add-to-basket parts', () => {
    expect(component.getParts(orderTemplates[0])).toEqual([
      { sku: 'SKU1', quantity: 1 },
      { sku: 'SKU2', quantity: 3 },
    ]);
  });
});
