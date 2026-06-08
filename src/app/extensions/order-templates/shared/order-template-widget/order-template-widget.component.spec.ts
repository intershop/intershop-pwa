import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

import { OrderTemplateWidgetComponent } from './order-template-widget.component';

describe('Order Template Widget Component', () => {
  let component: OrderTemplateWidgetComponent;
  let fixture: ComponentFixture<OrderTemplateWidgetComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;
  let shoppingFacade: ShoppingFacade;

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
    shoppingFacade = mock(ShoppingFacade);
    when(orderTemplatesFacade.orderTemplates$).thenReturn(of(orderTemplates));
    when(orderTemplatesFacade.orderTemplateLoading$).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [RouterModule, TranslatePipe],
      declarations: [MockComponent(InfoBoxComponent), MockComponent(LoadingComponent), OrderTemplateWidgetComponent],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
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

  it('should limit displayed order templates to 3', () => {
    const manyTemplates = [
      { id: '1', title: 'template 1', itemsCount: 0, items: [] },
      { id: '2', title: 'template 2', itemsCount: 0, items: [] },
      { id: '3', title: 'template 3', itemsCount: 0, items: [] },
      { id: '4', title: 'template 4', itemsCount: 0, items: [] },
    ] as OrderTemplate[];
    when(orderTemplatesFacade.orderTemplates$).thenReturn(of(manyTemplates));
    fixture.detectChanges();
    expect(element.querySelectorAll('[data-testing-id="addToCartButton"]')).toHaveLength(0);
    expect(element.querySelector('.loading-container').textContent).not.toContain('template 4');
  });

  it('should render add to cart button for templates with items', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('[data-testing-id="addToCartButton"]')).toHaveLength(2);
  });

  describe('addToBasket', () => {
    it('should add products to basket when items are already loaded', () => {
      fixture.detectChanges();
      component.addToBasket('1');
      verify(shoppingFacade.addProductsToBasket(anything())).once();
    });

    it('should load order template details if items are not fully loaded', () => {
      const partialTemplate = [{ id: '1', title: 'order template', itemsCount: 2, items: [] }] as OrderTemplate[];
      const fullyLoadedTemplate = [
        {
          id: '1',
          title: 'order template',
          itemsCount: 2,
          items: [
            { sku: 'SKU1', id: '1', creationDate: 0, desiredQuantity: { value: 1 } },
            { sku: 'SKU2', id: '2', creationDate: 0, desiredQuantity: { value: 3 } },
          ],
        },
      ] as OrderTemplate[];

      const subject$ = new BehaviorSubject<OrderTemplate[]>(partialTemplate);
      when(orderTemplatesFacade.orderTemplates$).thenReturn(subject$);
      fixture.detectChanges();

      component.addToBasket('1');
      verify(orderTemplatesFacade.loadOrderTemplateDetails('1')).once();

      subject$.next(fullyLoadedTemplate);
      verify(shoppingFacade.addProductsToBasket(anything())).once();
    });
  });
});
