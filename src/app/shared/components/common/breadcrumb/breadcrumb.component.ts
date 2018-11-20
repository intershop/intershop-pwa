import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  @Input()
  separator = '/';
  @Input()
  showHome = true;
  @Input()
  category: CategoryView;
  @Input()
  product: Product;
  @Input()
  searchTerm: string;
  @Input()
  account: boolean;
  @Input()
  trail: BreadcrumbItem[] = [];
}
