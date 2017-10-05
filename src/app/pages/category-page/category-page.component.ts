import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  selector: 'is-category-page',
  templateUrl: './category-page.component.html'
})

export class CategoryPageComponent implements OnInit {

  category: Category = null;

  // TODO: these properties were copied from family-page.component and their relevance needs to be evaluated
  isListView: Boolean;
  sortBy;
  totalItems: number;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // TODO: use this.route.snapshot.url instead of internal this.route.snapshot['_routerState'].url
      this.categoriesService.getCategory(this.route.snapshot['_routerState'].url.split('/category')[1]).subscribe((data: Category) => {
        this.category = data;
      });
    });
  }

}
