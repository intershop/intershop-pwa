import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, capture, instance, mock, spy, verify } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { AccountOrderTemplateListComponent } from './account-order-template-list.component';

describe('Account Order Template List Component', () => {
  let component: AccountOrderTemplateListComponent;
  let fixture: ComponentFixture<AccountOrderTemplateListComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  const orderTemplateDetails = [
    {
      title: 'testing order template',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 1,
      public: false,
      items: [
        {
          sku: '1234',
          id: '12345',
          creationDate: 123124125,
          desiredQuantity: {
            value: 1,
          },
        },
      ],
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
    shoppingFacadeMock = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        AccountOrderTemplateListComponent,
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductAddToBasketComponent),
        MockPipe(DatePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit delete id when delete is called', () => {
    const emitter = spy(component.deleteOrderTemplate);

    component.delete('deleteId');

    verify(emitter.emit('deleteId')).once();
  });

  it('should trigger add product to cart with right sku', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.orderTemplates = orderTemplateDetails;
    component.addTemplateToCart('.SKsEQAE4FIAAAFuNiUBWx0d');

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).once();
    expect(capture(shoppingFacadeMock.addProductToBasket).last()).toMatchInlineSnapshot(`
      Array [
        "1234",
        1,
      ]
    `);
  });

  it('should not trigger add to product if template doesnt have items', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.orderTemplates = orderTemplateDetails;
    component.addTemplateToCart('.AsdHS18FIAAAFuNiUBWx0d');

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).never();
  });
});
