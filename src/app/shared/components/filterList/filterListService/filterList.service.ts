import { Injectable } from '@angular/core';
import { InstanceService } from '../../../services/instance.service';
import { FilterListApiService, FilterListMockService } from './index';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
import { data } from '../filterList.mock';
import { FilterListData } from '../filterEntries';

@Injectable()
export class FilterListService {
  categoryListService: ICategoryService;

  /**
   * decides the service to be used as per environment variable
   * @param  {InstanceService} privateinstanceService
   */
  constructor(private instanceService: InstanceService) {
    this.categoryListService = this.instanceService.getInstance((environment.needMock) ?
      FilterListMockService : FilterListApiService);
  }

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<FilterListData> {
    return this.categoryListService.getSideFilters();
  }
}


export interface ICategoryService {
  getSideFilters(): Observable<any>;
}
