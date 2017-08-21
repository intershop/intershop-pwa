import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HeaderNavigationSubcategoryModel } from './header-navigation-subcategory.model';
import { HeaderNavigationCategoryModel } from './header-navigation-category.model';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/services/api.service';

@Injectable()
export class HeaderNavigationApiService {
    constructor(private apiService: ApiService) { }
    /**
     * retuns subcategories based on the category passed
     * @param  {} categoryId
     * @returns Observable
     */
    public getSubCategories(categoryId): Observable<HeaderNavigationSubcategoryModel> {
        return this.apiService.get('categories/' + categoryId);
    }
    /**
     * returns list of categories
     * @returns Observable
     */
    public getCategories(): Observable<HeaderNavigationCategoryModel> {
        return this.apiService.get('categories');
    }
}




