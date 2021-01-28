import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';

import { AccountOrderTemplateListComponent } from './account-order-template-list.component';

describe('Account Order Template List Component', () => {
  let component: AccountOrderTemplateListComponent;
  let fixture: ComponentFixture<AccountOrderTemplateListComponent>;
  let element: HTMLElement;
  let orderTemplateFacadeMock: OrderTemplatesFacade;

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
    orderTemplateFacadeMock = mock(OrderTemplatesFacade);
    when(orderTemplateFacadeMock.addOrderTemplateToBasket(anything())).thenReturn();
    await TestBed.configureTestingModule({
      declarations: [
        AccountOrderTemplateListComponent,
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductAddToBasketComponent),
        MockPipe(DatePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplateFacadeMock) }],
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

  it('should trigger add product to basket with right order template', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.orderTemplates = orderTemplateDetails;
    component.addTemplateToBasket(orderTemplateDetails[0]);

    verify(orderTemplateFacadeMock.addOrderTemplateToBasket(anything())).once();
    expect(capture(orderTemplateFacadeMock.addOrderTemplateToBasket).last()).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": ".SKsEQAE4FIAAAFuNiUBWx0d",
          "items": Array [
            Object {
              "creationDate": 123124125,
              "desiredQuantity": Object {
                "value": 1,
              },
              "id": "12345",
              "sku": "1234",
            },
          ],
          "itemsCount": 1,
          "public": false,
          "title": "testing order template",
        },
      ]
    `);
  });
});
