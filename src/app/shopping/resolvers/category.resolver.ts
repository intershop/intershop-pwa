import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../models/category.model';

@Injectable()
export class CategoryResolver implements Resolve<Category> {

  constructor(
    private categoriesService: CategoriesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category> {
    const categoryPath = route.url.map(x => x.path).join('/');
    // TODO: redirect to /error when category not found
    return this.categoriesService.getCategory(categoryPath);
  }

}
