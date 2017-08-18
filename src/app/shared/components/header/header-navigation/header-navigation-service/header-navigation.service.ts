import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InstanceService } from '../../../../../shared/services/instance.service';
import { HeaderNavigationApiService } from './header-navigation.service.api';
import { HeaderNavigationMockService } from './header-navigation.service.mock';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class HeaderNavigationService {
    headerNavigationService: IHeaderNavigationService;

    /**
     * decides the service to be used as per environment variable
     * @param  {InstanceService} privateinstanceService
     */
    constructor(private instanceService: InstanceService) {
        this.headerNavigationService = this.instanceService.getInstance((environment.needMock) ?
            HeaderNavigationMockService : HeaderNavigationApiService);
    }

    /**
     * @returns List of subcategories as an Observable
     */
    getSubCategories(categoryId): Observable<any> {
        return this.headerNavigationService.getSubCategories(categoryId);
    }

    /**
   * @returns List of categories as an Observable
   */
    getCategories(): Observable<any> {
        return this.headerNavigationService.getCategories();
    }

}

export interface IHeaderNavigationService {
    getSubCategories(categoryId): Observable<any>;
    getCategories(): Observable<any>;
}
