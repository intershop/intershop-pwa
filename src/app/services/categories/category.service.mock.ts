import { Observable } from 'rxjs/Observable';
import { CategoriesMock, SubCategoriesMock } from './categories.mock';
import 'rxjs/add/operator/map';
import { SubcategoryModel } from './subcategory.model';
import { CategoryModel } from './category.model';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryMockService {


  /**
     * retuns subcategories based on the category passed
     * @param  {} categoryId
     * @returns Observable
  */
  public getSubCategories(categoryId): Observable<SubcategoryModel> {
    const subCategories = (SubCategoriesMock.find(item => item.id === categoryId));
    return Observable.of(subCategories as SubcategoryModel);
  }

  /**
     * returns list of categories
     * @returns Observable
  */
  public getCategories(): Observable<CategoryModel> {
    return Observable.of(CategoriesMock as CategoryModel);
  }
}




