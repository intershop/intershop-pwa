import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsComponent {
  @Input() product: Product;
  @Output() productToCompare = new EventEmitter<void>();

  // TODO: to be removed once channelName inforamtion available in system
  channelName = 'inTRONICS';

  isMasterProduct = ProductHelper.isMasterProduct;

  constructor(private location: Location, @Inject(ICM_BASE_URL) public icmBaseURL) {}

  get currentUrl(): string {
    return this.icmBaseURL + this.location.path();
  }

  addToCompare() {
    this.productToCompare.emit();
  }
}
