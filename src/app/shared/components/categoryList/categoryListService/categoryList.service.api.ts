import { Observable } from 'rxjs/Rx'
import { Injectable } from '@angular/core'
import { ApiService } from "app/shared/services";
import { ICategoryService } from "app/shared/components/categoryList/categoryListService/iCategoryList.service";

@Injectable()
export class CategoryApiService implements ICategoryService {
    apiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
     }

    getSideFilters() : Observable<any> {
        return this.apiService.get("url");
    }
}