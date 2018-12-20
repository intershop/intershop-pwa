import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

function buildTrailFromCategoryOrProduct(category: CategoryView, product: ProductView) {
  const trail = [];

  // use incoming category if set, if not fallback to product default category
  const usedCategory = category ? category : product ? product.defaultCategory() : undefined;
  if (usedCategory) {
    trail.push(
      ...usedCategory.pathCategories().map(cat => ({
        text: cat.name,
        link: `/category/${cat.uniqueId}`,
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

@Component({
  selector: 'ish-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnChanges {
  @Input()
  separator = '/';
  @Input()
  showHome = true;
  @Input()
  category: CategoryView;
  @Input()
  product: ProductView;
  @Input()
  searchTerm: string;
  @Input()
  account: boolean;
  @Input()
  trail: BreadcrumbItem[] = [];

  ngOnChanges(c: SimpleChanges) {
    if (c.category || c.product) {
      this.replaceTrail(buildTrailFromCategoryOrProduct(this.category, this.product));
    }
  }

  private replaceTrail(trail: BreadcrumbItem[]) {
    // manual work as re-assignement would possibly trigger change detection
    while (this.trail.length) {
      this.trail.pop();
    }
    this.trail.push(...trail);
  }
}
