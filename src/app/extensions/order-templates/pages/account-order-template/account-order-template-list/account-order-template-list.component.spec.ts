import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplateItem } from '../../../models/order-template/order-template.model';

import { AccountOrderTemplateListComponent } from './account-order-template-list.component';

describe('Account Order Template List Component', () => {
  let component: AccountOrderTemplateListComponent;
  let fixture: ComponentFixture<AccountOrderTemplateListComponent>;
  let element: HTMLElement;
  let orderTemplatesFacade: OrderTemplatesFacade;
  let shoppingFacade: ShoppingFacade;

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
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [AccountOrderTemplateListComponent, MockComponent(ModalDialogComponent), MockPipe(DatePipe)],
      imports: [CdkTableModule, RouterModule, TranslatePipe],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
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

  it('should display empty list text if there are no order template', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });

  it('should render table when provided with data', () => {
    component.orderTemplates = orderTemplateDetails;
    fixture.detectChanges();

    expect(element.querySelector('table.cdk-table')).toBeTruthy();
    expect(element.querySelectorAll('table tr.cdk-row')).toHaveLength(3);
  });

  it('should emit delete id when delete is called', () => {
    when(orderTemplatesFacade.deleteOrderTemplate(anything())).thenReturn();

    component.delete('deleteId');

    verify(orderTemplatesFacade.deleteOrderTemplate('deleteId')).once();
  });

  it('should call facade loadOrderTemplateDetails when loadOrderTemplateDetails is called', () => {
    when(orderTemplatesFacade.loadOrderTemplateDetails(anything())).thenReturn();

    component.loadOrderTemplateDetails('.SKsEQAE4FIAAAFuNiUBWx0d');

    verify(orderTemplatesFacade.loadOrderTemplateDetails('.SKsEQAE4FIAAAFuNiUBWx0d')).once();
  });

  describe('addToBasket', () => {
    it('should set displaySpinner$ to true when called', done => {
      when(orderTemplatesFacade.orderTemplates$).thenReturn(of([]));

      component.displaySpinner$.subscribe(value => {
        if (value) {
          expect(value).toBeTrue();
          done();
        }
      });

      component.addToBasket('.SKsEQAE4FIAAAFuNiUBWx0d');
    });

    it('should call loadOrderTemplateDetails when items are not loaded yet', () => {
      const templateWithoutItems = [
        {
          title: 'testing order template',
          id: '.SKsEQAE4FIAAAFuNiUBWx0d',
          itemsCount: 2,
          public: false,
          items: [] as OrderTemplateItem[],
        },
      ];
      when(orderTemplatesFacade.orderTemplates$).thenReturn(of(templateWithoutItems));
      when(orderTemplatesFacade.loadOrderTemplateDetails(anything())).thenReturn();

      component.addToBasket('.SKsEQAE4FIAAAFuNiUBWx0d');

      verify(orderTemplatesFacade.loadOrderTemplateDetails('.SKsEQAE4FIAAAFuNiUBWx0d')).once();
    });

    it('should call shoppingFacade.addProductsToBasket when items are already loaded', () => {
      when(orderTemplatesFacade.orderTemplates$).thenReturn(of(orderTemplateDetails));
      when(shoppingFacade.addProductsToBasket(anything())).thenReturn();

      component.addToBasket('.SKsEQAE4FIAAAFuNiUBWx0d');

      verify(shoppingFacade.addProductsToBasket(anything())).once();
    });

    it('should set displaySpinner$ to false after adding products to basket', done => {
      when(orderTemplatesFacade.orderTemplates$).thenReturn(of(orderTemplateDetails));
      when(shoppingFacade.addProductsToBasket(anything())).thenReturn();

      const values: boolean[] = [];
      component.displaySpinner$.subscribe(value => {
        values.push(value);
        if (values.length === 3) {
          expect(values).toEqual([false, true, false]);
          done();
        }
      });

      component.addToBasket('.SKsEQAE4FIAAAFuNiUBWx0d');
    });
  });
});
