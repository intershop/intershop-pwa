import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductNotificationDialogComponent } from '../product-notification-dialog/product-notification-dialog.component';

@Component({
  selector: 'ish-product-notification-edit',
  templateUrl: './product-notification-edit.component.html',
  styleUrls: ['./product-notification-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditComponent {
  @Input() cssClass: string;

  openModal(modal: ProductNotificationDialogComponent) {
    modal.show();
  }
}
