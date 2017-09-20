import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InstanceService } from '../../services/instance.service';
import { CategoriesApiService } from './categories.service.api';
import { CategoriesMockService } from './categories.service.mock';
import { environment } from '../../../environments/environment';
import { Category } from './category.model';
@Injectable()
export class CategoriesService {
  categoryService;

  /**
   * decides the service to be used as per environment variable
   * @param  {InstanceService} privateinstanceService
   */
  constructor(private instanceService: InstanceService) {
    this.categoryService = this.instanceService.getInstance((environment.needMock) ?
      CategoriesMockService : CategoriesApiService);
  }

  /**
 * @returns List of categories as an Observable
 */
  getCategories(uri: string): Observable<Category[]> {
    return this.categoryService.getCategories(uri);
  }

}



