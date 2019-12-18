import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { CategoryRoutePipe } from 'ish-core/pipes/category-route.pipe';

@Component({
  selector: 'ish-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements DoCheck {
  @Input() separator = '/';
  @Input() showHome = true;
  @Input() category: CategoryView;
  @Input() product: ProductView;
  @Input() searchTerm: string;
  @Input() account: boolean;
  @Input() trail: BreadcrumbItem[] = [];

  constructor(private categoryRoutePipe: CategoryRoutePipe) {}

  private buildTrailFromCategoryOrProduct(category: CategoryView, product: ProductView) {
    const trail = [];

    // use incoming category if set, if not fallback to product default category
    const usedCategory = category ? category : product ? product.defaultCategory() : undefined;
    if (usedCategory) {
      trail.push(
        ...usedCategory.pathCategories().map(cat => ({
          text: cat.name,
          link: this.categoryRoutePipe.transform(cat),
        }))
      );
    }

    if (product) {
      trail.push({ text: product.name });
    } else if (trail.length) {
      // remove link from last category entry
      trail[trail.length - 1].link = undefined;
    }

    return trail;
  }

  ngDoCheck() {
    if (this.category || this.product) {
      // tslint:disable-next-line:no-assignement-to-inputs
      this.trail = this.buildTrailFromCategoryOrProduct(this.category, this.product);
    }
  }
}
