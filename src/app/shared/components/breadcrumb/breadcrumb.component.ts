import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BreadcrumbItem } from '../../../models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';

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
