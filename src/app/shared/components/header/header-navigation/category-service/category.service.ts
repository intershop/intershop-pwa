import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { CategoryApiService } from './category.service.api';
import { CategoryMockService } from './category.service.mock';
import { environment } from '../../../../../../environments/environment';
import { CategoryModel } from './category.model';
import { SubcategoryModel } from './subcategory.model';

@Injectable()
export class CategoryService {
    categoryService: ICategoryService;

    /**
     * decides the service to be used as per environment variable
     * @param  {InstanceService} privateinstanceService
     */
    constructor(private instanceService: InstanceService) {
        this.categoryService = this.instanceService.getInstance((environment.needMock) ?
            CategoryMockService : CategoryApiService);
    }

    /**
     * @returns List of subcategories as an Observable
     */
    getSubCategories(categoryId): Observable<SubcategoryModel> {
        return this.categoryService.getSubCategories(categoryId);
    }

    /**
   * @returns List of categories as an Observable
   */
    getCategories(): Observable<CategoryModel> {
        return this.categoryService.getCategories();
    }

}

export interface ICategoryService {
    getSubCategories(categoryId): Observable<any>;
    getCategories(): Observable<any>;
}
