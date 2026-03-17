import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';

import { CategoryCategoriesComponent } from './category-categories/category-categories.component';
import { CategoryProductsComponent } from './category-products/category-products.component';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ AsyncPipe, CategoryCategoriesComponent, CategoryProductsComponent],
})
export class CategoryPageComponent implements OnInit {
  category$: Observable<CategoryView>;
  deviceType$: Observable<DeviceType>;

  constructor(private shoppingFacade: ShoppingFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    // prevent flickering after login by waiting for a valid category
    this.category$ = this.shoppingFacade.selectedCategory$.pipe(whenTruthy());
    this.deviceType$ = this.appFacade.deviceType$;
  }
}
