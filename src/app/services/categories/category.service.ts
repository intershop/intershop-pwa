import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CategoryModel } from './category.model';
import { SubcategoryModel } from './subcategory.model';
import { ApiService } from '../';

@Injectable()
export class CategoryService {

    /**
     * @param  {ApiService} privateapiService
     */
    constructor(private apiService: ApiService) {
    }

    /**
     * @returns List of subcategories as an Observable
     */
    getSubCategories(categoryId): Observable<SubcategoryModel> {
        return this.apiService.get('categories/' + categoryId);
    }

    /**
     * @returns List of categories as an Observable
     */
    getCategories(): Observable<CategoryModel> {
        return this.apiService.get('categories');
    }
}
