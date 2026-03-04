import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { IconModule } from 'ish-core/icon.module';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { InjectSingle } from 'ish-core/utils/injection';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { SubCategoryNavigationComponent } from 'ish-shell/header/sub-category-navigation/sub-category-navigation.component';

@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    IconModule,
    NgClass,
    NgFor,
    NgIf,
    NgStyle,
    RouterLink,
    ContentIncludeComponent,
    SubCategoryNavigationComponent,
    TranslateModule,
  ],
})
export class HeaderNavigationComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  categories$: Observable<NavigationCategory[]>;

  private openedCategories: string[] = [];

  // make variable SSR, that is used to check if the application is running in SSR or browser context, accessible in the template
  isBrowser = !SSR;

  constructor(
    private shoppingFacade: ShoppingFacade,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH)
    public mainNavigationMaxSubCategoriesDepth: InjectSingle<typeof MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH>
  ) {}

  ngOnInit() {
    this.categories$ = this.shoppingFacade.navigationCategories$().pipe(
      // filter out categories that should be hidden in the menu
      map(categories => categories.filter(category => !category?.hideInMenu))
    );
  }

  /**
   * Handle sub menu show.
   * Adds hover class to rendered element.
   *
   * @param subMenu The rendered sub menu element.
   */
  subMenuShow(subMenu: HTMLElement) {
    subMenu.classList.add('hover');
  }

  /**
   * Handle sub menu hide.
   * Removes hover class from rendered element.
   *
   * @param subMenu The rendered sub menu element.
   */
  subMenuHide(subMenu: HTMLElement) {
    subMenu.classList.remove('hover');
  }

  /**
   * Indicate if specific category is expanded.
   *
   * @param category The category item.
   */
  isOpened(uniqueId: string): boolean {
    return this.openedCategories.includes(uniqueId);
  }

  /**
   * Toggle category open state.
   *
   * @param category The category item.
   */
  toggleOpen(uniqueId: string) {
    const index = this.openedCategories.findIndex(id => id === uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(uniqueId);
  }
}
