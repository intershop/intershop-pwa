import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
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
  rootCategory: Category;
  selectedCategoryUri: string;

  constructor(private categoriesService: CategoriesService,
    private route: ActivatedRoute) { }
  ngOnInit() {
   this.loadRootCategory();
  }

  loadRootCategory(){
     this.selectedCategoryUri = this.route.snapshot['_routerState'].url.split('/category')[1];
    const rootCatName = '/' + this.selectedCategoryUri.split('/')[1];
    // TODO: use this.route.snapshot.url instead of internal this.route.snapshot['_routerState'].url
    this.categoriesService.getCategory(rootCatName).subscribe((data: Category) => {
      this.rootCategory = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
     this.loadRootCategory();
  }
}

