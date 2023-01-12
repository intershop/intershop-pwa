import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

import { ProductNotificationType } from '../../../models/product-notification/product-notification.model';

import { AccountProductNotificationsListComponent } from './account-product-notifications-list.component';

describe('Account Product Notifications List Component', () => {
  let component: AccountProductNotificationsListComponent;
  let fixture: ComponentFixture<AccountProductNotificationsListComponent>;
  let element: HTMLElement;

  const productNotifications = [
    {
      id: '123_stock',
      type: 'stock' as ProductNotificationType,
      sku: '1234',
      notificationMailAddress: 'test@test.intershop.de',
    },
    {
      id: '456_stock',
      type: 'stock' as ProductNotificationType,
      sku: '5678',
      notificationMailAddress: 'test@test.intershop.de',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdkTableModule, TranslateModule.forRoot()],
      declarations: [
        AccountProductNotificationsListComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductPriceComponent),
        MockDirective(ProductContextDirective),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProductNotificationsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text and no table if there are no order template', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();

    expect(element.querySelector('[data-testing-id=th-product-image]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-product-info]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-notification]')).toBeFalsy();
  });

  it('should render table when provided with data', () => {
    component.productNotifications = productNotifications;
    component.columnsToDisplay = ['productImage', 'product', 'notification'];
    fixture.detectChanges();

    expect(element.querySelector('table.cdk-table')).toBeTruthy();
    expect(element.querySelectorAll('table tr.cdk-row')).toHaveLength(2);
  });

  it('should display table columns productImage if it is configured', () => {
    component.productNotifications = productNotifications;
    component.columnsToDisplay = ['productImage', 'product', 'notification'];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-product-image]')).toBeTruthy();
  });

  it('should display table column product if it is configured', () => {
    component.productNotifications = productNotifications;
    component.columnsToDisplay = ['product'];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-product]')).toBeTruthy();
  });

  it('should display table column notification if it is configured', () => {
    component.productNotifications = productNotifications;
    component.columnsToDisplay = ['notification'];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-notification]')).toBeTruthy();
  });
});
