import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

@Component({
  selector: 'ish-category-navigation',
  templateUrl: './category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryNavigationComponent implements OnInit, OnChanges {
  @Input() uniqueId: string;

  navigationCategories$: Observable<NavigationCategory[]>;
  currentCategoryId$: Observable<string>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.currentCategoryId$ = this.shoppingFacade.selectedCategory$.pipe(map(c => c?.uniqueId));
  }

  ngOnChanges() {
    this.navigationCategories$ = this.shoppingFacade.navigationCategories$(this.uniqueId);
  }
}
