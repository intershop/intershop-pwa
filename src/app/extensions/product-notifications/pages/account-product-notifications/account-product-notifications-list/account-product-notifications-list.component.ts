import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductNotification } from '../../../models/product-notification/product-notification.model';

type ProductNotificationsColumnsType = 'productImage' | 'product' | 'notification' | 'notificationEdit';

@Component({
  selector: 'ish-account-product-notifications-list',
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
    'notificationEdit',
  ];
}
