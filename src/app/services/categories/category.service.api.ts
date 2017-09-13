import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SubcategoryModel } from './subcategory.model';
import { CategoryModel } from './category.model';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable()
export class CategoryApiService {
    constructor(private apiService: ApiService) { }
    /**
     * retuns subcategories based on the category passed
     * @param  {} categoryId
     * @returns Observable
     */
    public getSubCategories(categoryId): Observable<SubcategoryModel> {
        return this.apiService.get('categories/' + categoryId);
    }
    /**
     * returns list of categories
     * @returns Observable
     */
    public getCategories(): Observable<CategoryModel> {
        return this.apiService.get('categories');
    }
}




