import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

/**
 * The Sub Category Navigation Component displays second level category navigation.
 */
@Component({
  selector: 'ish-sub-category-navigation',
  templateUrl: './sub-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryNavigationComponent implements OnInit {
  @Input() view = 'auto';
  @Input() categoryUniqueId: string;
  @Input() subCategoriesDepth: number;

  openedCategories: string[] = [];

  navigationCategories$: Observable<NavigationCategory[]>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) public mainNavigationMaxSubCategoriesDepth: number
  ) {}

  ngOnInit() {
    this.navigationCategories$ = this.shoppingFacade.navigationCategories$(this.categoryUniqueId);
  }

  /**
   * Indicate if specific category is expanded.
   */
  isOpened(uniqueId: string): boolean {
    return this.openedCategories.includes(uniqueId);
  }

  /**
   * Toggle category open state.
   */
  toggleOpen(uniqueId: string) {
    const index = this.openedCategories.findIndex(id => id === uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(uniqueId);
  }
}
