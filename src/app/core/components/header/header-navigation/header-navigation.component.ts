import { Component, Input, OnInit } from '@angular/core';
import { CurrentLocaleService } from '../../../../core/services/locale/current-locale.service';
import { Category } from '../../../../models/category/category.model';
import { CategoriesService } from '../../../services/categories/categories.service';

@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  @Input() maxSubCategoriesDepth = 0;
  categories: Category[];

  constructor(
    public categoriesService: CategoriesService,
    private currentLocaleService: CurrentLocaleService
  ) { }

  ngOnInit() {
    this.currentLocaleService.subscribe(() => {
      this.categoriesService.getTopLevelCategories(this.maxSubCategoriesDepth).subscribe((response: Category[]) => {
        if (typeof (response) === 'object') {
          this.categories = response;
        }
      });
    });
  }
}
