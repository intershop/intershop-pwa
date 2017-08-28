import { Injectable } from '@angular/core';
import { InstanceService } from 'app/services/instance.service';
import { FilterListMockService } from './filter-list.service.mock';
import { FilterListApiService } from './filter-list.service.api';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { data } from './filter-list.mock';
import { FilterListModel } from './filter-entries';

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
  getSideFilters(): Observable<FilterListModel> {
    return this.categoryListService.getSideFilters();
  }
}


export interface ICategoryService {
  getSideFilters(): Observable<any>;
}
