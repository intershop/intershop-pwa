import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../services/categories/categories.service';

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
