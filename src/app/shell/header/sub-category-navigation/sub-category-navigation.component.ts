import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, forwardRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { InjectSingle } from 'ish-core/utils/injection';

/**
 * The Sub Category Navigation Component displays second level category navigation.
 */
@Component({
  selector: 'ish-sub-category-navigation',
  templateUrl: './sub-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    forwardRef(() => SubCategoryNavigationComponent),
    NgIf,
    NgFor,
    TranslatePipe,
    AsyncPipe,
    NgClass,
    NgStyle,
    RouterLink,
  ],
})
export class SubCategoryNavigationComponent implements OnInit {
  @Input({ required: true }) categoryUniqueId: string;
  @Input({ required: true }) subCategoriesDepth: number;
  @Input() view = 'auto';

  private openedCategories: string[] = [];

  navigationCategories$: Observable<NavigationCategory[]>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH)
    public mainNavigationMaxSubCategoriesDepth: InjectSingle<typeof MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH>
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
