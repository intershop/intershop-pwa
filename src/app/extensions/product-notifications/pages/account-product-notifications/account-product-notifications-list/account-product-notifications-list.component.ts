import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductNotification } from '../../../models/product-notification/product-notification.model';

@Component({
  selector: 'ish-account-product-notifications-list',
  templateUrl: './account-product-notifications-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProductNotificationsListComponent {
  @Input() productNotifications: ProductNotification[];
}
