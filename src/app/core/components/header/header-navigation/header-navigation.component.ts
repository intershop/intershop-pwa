import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Category } from '../../../../models/category/category.model';
import * as fromCategories from '../../../../shopping/store/categories';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CoreState, getCurrentLocale } from '../../../store/locale';


@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  @Input() maxSubCategoriesDepth = 0;
  categories$: Observable<Category[]>;

  constructor(
    private store: Store<CoreState>,
    public categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.categories$ = this.store.pipe(select(fromCategories.getTopLevelCategories));

    // TODO: this should be an effect
    this.store.pipe(select(getCurrentLocale)).subscribe(() => {
      /*this.categoriesService.getTopLevelCategories(this.maxSubCategoriesDepth).subscribe((response: Category[]) => {
        if (typeof (response) === 'object') {
          this.categories = response;
        }
      });*/
    });

    this.store.dispatch(new fromCategories.LoadTopLevelCategories(this.maxSubCategoriesDepth));
  }

  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }
  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }

}
