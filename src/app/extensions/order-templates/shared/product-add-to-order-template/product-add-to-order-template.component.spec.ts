import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { SelectOrderTemplateModalComponent } from '../select-order-template-modal/select-order-template-modal.component';

import { ProductAddToOrderTemplateComponent } from './product-add-to-order-template.component';

describe('Product Add To Order Template Component', () => {
  let component: ProductAddToOrderTemplateComponent;
  let fixture: ComponentFixture<ProductAddToOrderTemplateComponent>;
  let element: HTMLElement;
  let orderTemplateFacadeMock: OrderTemplatesFacade;
  let accountFacadeMock: AccountFacade;

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

  beforeEach(async(() => {
    orderTemplateFacadeMock = mock(OrderTemplatesFacade);
    accountFacadeMock = mock(AccountFacade);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(SelectOrderTemplateModalComponent),
        ProductAddToOrderTemplateComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplateFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(orderTemplateFacadeMock.orderTemplates$).thenReturn(of(orderTemplateDetails));
    component.product = { name: 'Test Product', sku: 'test sku' } as Product;
    component.quantity = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call orderTemplateFacade to add product to order template', () => {
    fixture.detectChanges();
    component.addProductToOrderTemplate({ id: 'testid', title: 'Test Order Template' });
    verify(orderTemplateFacadeMock.addProductToOrderTemplate(anyString(), anyString(), anyNumber())).once();
  });

  it('should call orderTemplateFacade to add product to new order template', () => {
    fixture.detectChanges();
    component.addProductToOrderTemplate({ id: undefined, title: 'Test Order Template' });
    verify(orderTemplateFacadeMock.addProductToNewOrderTemplate(anyString(), anyString(), anyNumber())).once();
  });
});
