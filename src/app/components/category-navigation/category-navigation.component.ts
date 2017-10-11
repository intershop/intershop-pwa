import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  selector: 'is-category-navigation',
  templateUrl: './category-navigation.component.html'
})

export class CategoryNavigationComponent implements OnInit, OnChanges {
  @Input() selectedCategory: Category;
  topLevelCategory: Category;
  currentCategoryUri: string;

  constructor(private categoriesService: CategoriesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadTopLevelCategory();
  }

  loadTopLevelCategory() {
    this.currentCategoryUri = this.route.snapshot.url.toString().split('/category')[1];
    const rootCatName = '/' + this.currentCategoryUri.split('/')[1];
    // TODO: use this.route.snapshot.url instead of internal this.route.snapshot['_routerState'].url
    this.categoriesService.getCategory(rootCatName).subscribe((data: Category) => {
      this.topLevelCategory = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadTopLevelCategory();
  }
}

