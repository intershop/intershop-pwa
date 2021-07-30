import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-attachments',
  templateUrl: './product-attachments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAttachmentsComponent {
  @Input() product: ProductView;
}
