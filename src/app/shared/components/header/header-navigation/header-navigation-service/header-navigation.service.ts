import { Observable } from 'rxjs/Observable';
import { CategoriesMock, SubCategoriesMock } from '../header-navigation-mock';
import 'rxjs/add/operator/map';
import { HeaderNavigationSubcategoryModel } from './header-navigation-subcategory.model';
import { HeaderNavigationCategoryModel } from './header-navigation-category.model';


export class HeaderNavigationService {
  public getSubCategories(): Observable<HeaderNavigationSubcategoryModel> {
    return Observable.of(SubCategoriesMock);
  }

  public getCategories(): Observable<HeaderNavigationCategoryModel> {
    return Observable.of(CategoriesMock as HeaderNavigationCategoryModel);
  }
};




