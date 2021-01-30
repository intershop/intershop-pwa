import { I18nPluralPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { AccountOrderTemplateListComponent } from './account-order-template-list.component';

describe('Account Order Template List Component', () => {
  let component: AccountOrderTemplateListComponent;
  let fixture: ComponentFixture<AccountOrderTemplateListComponent>;
  let element: HTMLElement;

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
    await TestBed.configureTestingModule({
      declarations: [
        AccountOrderTemplateListComponent,
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductAddToBasketComponent),
        MockDirective(ProductContextDirective),
        MockPipe(DatePipe),
        MockPipe(I18nPluralPipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
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

  it('should render table when provided with data', () => {
    component.orderTemplates = orderTemplateDetails;
    fixture.detectChanges();

    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "order-template-list-item-container",
        "order-template-list-item",
        "order-template-list-title",
        "order-template-list-title",
        "delete-order-template",
        "order-template-list-item-container",
        "order-template-list-item",
        "order-template-list-title",
        "order-template-list-title",
        "delete-order-template",
        "order-template-list-item-container",
        "order-template-list-item",
        "order-template-list-title",
        "order-template-list-title",
        "delete-order-template",
      ]
    `);
  });

  it('should emit delete id when delete is called', () => {
    const emitter = spy(component.deleteOrderTemplate);

    component.delete('deleteId');

    verify(emitter.emit('deleteId')).once();
  });
});
