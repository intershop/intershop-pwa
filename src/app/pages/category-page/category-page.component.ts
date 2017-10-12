import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  Category
} from '../../services/categories/categories.model';
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
  friendlyPath: string; // Get friendly Name for current URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { category: Category }) => {
      this.category = data.category;
      this.categoriesService.getFriendlyPathOfCurrentCategory(this.router.url.split('/category/')[1]).subscribe(path => {
        this.friendlyPath = path;
      });
    });
  }
}
