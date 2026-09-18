import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductAdvisorProduct } from '../../../models/product-advisor-product/product-advisor-product.model';

@Component({
  selector: 'ish-product-advisor-results',
  standalone: false,
  templateUrl: './product-advisor-results.component.html',
  styleUrls: ['./product-advisor-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorResultsComponent {
  @Input() products: ProductAdvisorProduct[] = [];
}
