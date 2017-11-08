import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  selector: 'is-category-navigation',
  templateUrl: './category-navigation.component.html'
})

export class CategoryNavigationComponent implements OnInit {

  @Input() category: Category;
  categoryPath: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // the subscription to the route.data is only needed to retrigger the getCategoryPath call,
    // the routeCategory is not actually needed since it is tha same as the @Input category
    this.route.data.subscribe((data: { routeCategory: Category }) => {
      this.categoriesService.getCategoryPath(this.category, this.route.snapshot).subscribe((categoryPath: Category[]) => {
        this.categoryPath = categoryPath;
      });
    });
  }
}
