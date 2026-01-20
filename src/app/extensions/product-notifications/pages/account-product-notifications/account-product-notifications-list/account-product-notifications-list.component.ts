import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

import { ProductNotification } from '../../../models/product-notification/product-notification.model';
import { ProductNotificationDeleteComponent } from '../../../shared/product-notification-delete/product-notification-delete.component';
import { ProductNotificationEditComponent } from '../../../shared/product-notification-edit/product-notification-edit.component';

type ProductNotificationsColumnsType = 'productImage' | 'product' | 'notification' | 'notificationEditDelete';

@Component({
  selector: 'ish-account-product-notifications-list',
  templateUrl: './account-product-notifications-list.component.html',
  styleUrls: ['./account-product-notifications-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkTableModule,
    CommonModule,
    ProductContextDirective,
    ProductImageComponent,
    ProductNameComponent,
    ProductNotificationEditComponent,
    ProductNotificationDeleteComponent,
    ProductPriceComponent,
    RouterModule,
    TranslateModule,
    PricePipe,
  ],
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
