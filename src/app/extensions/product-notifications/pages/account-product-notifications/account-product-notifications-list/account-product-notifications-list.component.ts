import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductNotification } from '../../../models/product-notification/product-notification.model';

type ProductNotificationsColumnsType = 'notification' | 'notificationEditDelete' | 'product' | 'productImage';

@Component({
  selector: 'ish-account-product-notifications-list',
  standalone: false,
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
