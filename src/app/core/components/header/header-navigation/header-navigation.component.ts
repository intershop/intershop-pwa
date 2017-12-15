import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../../models/category.model';
import { CategoriesService } from '../../../../shared/services/categories/categories.service';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';

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
