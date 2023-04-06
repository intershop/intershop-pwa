import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { extractKeys } from 'ish-shared/formly/dev/testing/formly-testing-utils';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

import { ProductNotificationEditFormComponent } from './product-notification-edit-form.component';

describe('Product Notification Edit Form Component', () => {
  let component: ProductNotificationEditFormComponent;
  let fixture: ComponentFixture<ProductNotificationEditFormComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let appFacade: AppFacade;
  const product: ProductView = {} as ProductView;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationEditFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('form fields configuration', () => {
    it('should return correct fields when calling getFieldsForNoProductNotification if product is not available', () => {
      expect(extractKeys(component.getFieldsForNoProductNotification(product))).toMatchInlineSnapshot(`
        [
          "alertType",
          [
            "email",
          ],
        ]
      `);
    });

    it('should return correct fields when calling getFieldsForNoProductNotification if product is available', () => {
      product.available = true;

      expect(extractKeys(component.getFieldsForNoProductNotification(product))).toMatchInlineSnapshot(`
        [
          "alertType",
          [
            "priceValue",
            "email",
          ],
        ]
      `);
    });

    it('should return correct fields when calling getFieldsForProductNotification for price notification', () => {
      component.productNotification = {
        type: 'price',
      } as ProductNotification;

      product.available = true;

      expect(extractKeys(component.getFieldsForProductNotification(component.productNotification, product)))
        .toMatchInlineSnapshot(`
        [
          "alertType",
          "productNotificationId",
          "alertType",
          "priceValue",
          "email",
        ]
      `);
    });

    it('should return correct fields when calling getFieldsForProductNotification for stock notification', () => {
      component.productNotification = {
        type: 'stock',
      } as ProductNotification;

      product.available = false;

      expect(extractKeys(component.getFieldsForProductNotification(component.productNotification, product)))
        .toMatchInlineSnapshot(`
        [
          "alertType",
          "productNotificationId",
          "alertType",
          "email",
        ]
      `);
    });
  });
});
