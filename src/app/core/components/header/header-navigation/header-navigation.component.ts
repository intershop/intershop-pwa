import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Category } from '../../../../models/category/category.model';
import * as categoriesActions from '../../../../shopping/store/categories/categories.actions';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CoreState, getCurrentLocale } from '../../../store/locale';


@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  @Input() maxSubCategoriesDepth = 0;
  categories: Category[];

  constructor(
    private store: Store<CoreState>,
    public categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    // TODO: this should be an effect
    this.store.pipe(select(getCurrentLocale)).subscribe(() => {
      this.categoriesService.getTopLevelCategories(this.maxSubCategoriesDepth).subscribe((response: Category[]) => {
        if (typeof (response) === 'object') {
          this.categories = response;
        }
      });
    });

    this.store.dispatch(new categoriesActions.LoadTopLevelCategories(this.maxSubCategoriesDepth));
  }

  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }
  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }

}
