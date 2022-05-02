import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

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
    when(productContext.getItems()).thenReturn([{ sku: 'test sku', quantity: 1 }]);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(SelectOrderTemplateModalComponent), ProductAddToOrderTemplateComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplateFacade) },
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
    component.addProductsToOrderTemplate({ id: 'testid', title: 'Test Order Template' });
    verify(orderTemplateFacade.addProductsToOrderTemplate(anyString(), anything())).once();
  });

  it('should call orderTemplateFacade to add product to new order template', () => {
    fixture.detectChanges();
    component.addProductsToOrderTemplate({ id: undefined, title: 'Test Order Template' });
    verify(orderTemplateFacade.addProductsToNewOrderTemplate(anyString(), anything())).once();
  });
});
