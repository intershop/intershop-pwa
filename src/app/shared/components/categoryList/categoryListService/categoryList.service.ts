import {Injectable} from '@angular/core'
import {InstanceService} from '../../../services/instance.service';
import {CategoryMockService} from './categoryList.service.mock';
import {CategoryApiService} from './categoryList.service.api';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../../environments/environment.prod';
import {Data} from '../categoryList.mock';

@Injectable()
export class CategoryService {
  categoryListService: ICategoryService;

  /**
   * decides the service to be used as per environment variable
   * @param  {InstanceService} privateinstanceService
   */
  constructor(private instanceService: InstanceService) {
    this.categoryListService = this.instanceService.getInstance((environment.needMock) ?
      CategoryMockService : CategoryApiService);
  }

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<any> {
    return Observable.of(Data);
  }
}


export interface ICategoryService {
  getSideFilters(): Observable<any>;
}
