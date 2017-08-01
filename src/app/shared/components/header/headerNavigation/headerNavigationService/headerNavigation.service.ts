import { Observable } from 'rxjs/Observable';
import { CategoriesMock, SubCategoriesMock } from '../headerNavigationMock';
import 'rxjs/add/operator/map';
import { HeaderNavigationSubcategoryModel } from './headerNavigationSubcategory.model';
import { HeaderNavigationCategoryModel } from './headerNavigationCategory.model';


export class HeaderNavigationService {
  public getSubCategories(): Observable<HeaderNavigationSubcategoryModel> {
    return Observable.of(SubCategoriesMock);
  }

  public getCategories(): Observable<HeaderNavigationCategoryModel> {
    return Observable.of(CategoriesMock);
  }
};




