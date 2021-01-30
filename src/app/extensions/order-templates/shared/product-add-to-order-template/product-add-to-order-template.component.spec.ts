import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { SelectOrderTemplateModalComponent } from '../select-order-template-modal/select-order-template-modal.component';

import { ProductAddToOrderTemplateComponent } from './product-add-to-order-template.component';

describe('Product Add To Order Template Component', () => {
  let component: ProductAddToOrderTemplateComponent;
  let fixture: ComponentFixture<ProductAddToOrderTemplateComponent>;
  let element: HTMLElement;
  let orderTemplateFacade: OrderTemplatesFacade;
  let accountFacade: AccountFacade;

  const orderTemplateDetails = [
    {
      title: 'testing order template',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
    {
      title: 'testing order template 2',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
    {
      title: 'new order template',
      id: 'new order template id',
      itemsCount: 0,
      public: false,
    },
  ];

  beforeEach(async () => {
    orderTemplateFacade = mock(OrderTemplatesFacade);
    when(orderTemplateFacade.orderTemplates$).thenReturn(of(orderTemplateDetails));
    accountFacade = mock(AccountFacade);
    const productContext = mock(ProductContextFacade);
    when(productContext.get('sku')).thenReturn('test sku');
    when(productContext.get('quantity')).thenReturn(1);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(SelectOrderTemplateModalComponent),
        ProductAddToOrderTemplateComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplateFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(productContext) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call orderTemplateFacade to add product to order template', () => {
    fixture.detectChanges();
    component.addProductToOrderTemplate({ id: 'testid', title: 'Test Order Template' });
    verify(orderTemplateFacade.addProductToOrderTemplate(anyString(), anyString(), anyNumber())).once();
  });

  it('should call orderTemplateFacade to add product to new order template', () => {
    fixture.detectChanges();
    component.addProductToOrderTemplate({ id: undefined, title: 'Test Order Template' });
    verify(orderTemplateFacade.addProductToNewOrderTemplate(anyString(), anyString(), anyNumber())).once();
  });
});
