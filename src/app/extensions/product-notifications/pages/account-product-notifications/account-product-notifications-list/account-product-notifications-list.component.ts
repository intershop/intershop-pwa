import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

import { ProductNotification } from '../../../models/product-notification/product-notification.model';
import { ProductNotificationDeleteComponent } from '../../../shared/product-notification-delete/product-notification-delete.component';
import { ProductNotificationEditComponent } from '../../../shared/product-notification-edit/product-notification-edit.component';

type ProductNotificationsColumnsType = 'notification' | 'notificationEditDelete' | 'product' | 'productImage';

@Component({
  selector: 'ish-account-product-notifications-list',
  imports: [
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderCellDef,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CdkTable,
    PricePipe,
    ProductContextDirective,
    ProductImageComponent,
    ProductNameComponent,
    ProductNotificationDeleteComponent,
    ProductNotificationEditComponent,
    ProductPriceComponent,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './account-product-notifications-list.component.html',
  styleUrls: ['./account-product-notifications-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProductNotificationsListComponent {
  @Input() productNotifications: ProductNotification[];

  @Input() columnsToDisplay: ProductNotificationsColumnsType[] = [
    'productImage',
    'product',
    'notification',
    'notificationEditDelete',
  ];
}
