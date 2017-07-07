import { environment } from 'environments/environment';
import { Injectable } from '@angular/core'
import { ApiService } from "app/shared/services";
import { ICategoryService } from "app/shared/components/categoryList/categoryListService/iCategoryList.service";
import { CategoryMockService } from "app/shared/components/categoryList/categoryListService/categoryList.service.mock";
import { CategoryApiService } from "app/shared/components/categoryList/categoryListService/categoryList.service.api";



@Injectable()
export class CategoryService {
    serviceObj: ICategoryService;
    apiService: ApiService

    deciderFunction() {
        if (environment.needMock) {
            return this.serviceObj = new CategoryMockService();
        }
        else {
            return this.serviceObj = new CategoryApiService(this.apiService);
        }
    }
}