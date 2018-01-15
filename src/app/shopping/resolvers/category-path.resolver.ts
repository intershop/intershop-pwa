import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../models/category/category.model';

@Injectable()
export class CategoryPathResolver implements Resolve<Category[]> {

  constructor(
    private categoriesService: CategoriesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
    return this.categoriesService.getCategoryPathFromRoute(route);
  }

}
