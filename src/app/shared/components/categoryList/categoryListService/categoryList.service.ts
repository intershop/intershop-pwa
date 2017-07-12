import { environment } from 'environments/environment';
import { Injectable } from '@angular/core'
import { ApiService } from "app/shared/services";
import { CategoryMockService } from "app/shared/components/categoryList/categoryListService/categoryList.service.mock";
import { CategoryApiService } from "app/shared/components/categoryList/categoryListService/categoryList.service.api";
import { Observable } from "rxjs/Rx";
import { InstanceService } from "app/shared/services/instance.service";



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
        return this.categoryListService.getSideFilters();
    }
}


export interface ICategoryService {
    getSideFilters(): Observable<any>;
}