import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

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
    { id: '1', title: 'order template' },
    { id: '2', title: 'order template 2' },
  ] as OrderTemplate[];

  beforeEach(async () => {
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.orderTemplates$).thenReturn(of(orderTemplates));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductAddToBasketComponent),
        MockDirective(ProductContextDirective),
        OrderTemplateWidgetComponent,
      ],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) }],
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
    expect(element.querySelector('.loading-container').textContent).toMatchInlineSnapshot(
      `"order templateorder template 2"`
    );
  });
});
