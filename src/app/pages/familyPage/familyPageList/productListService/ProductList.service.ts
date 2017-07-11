import { Injectable, Injector } from '@angular/core'
import { ApiService } from "app/shared/services";
import { environment } from "environments/environment";
import { ProductListMockService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service.mock";
import { ProductListApiService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service.api";
import { Observable } from "rxjs/Observable";
import { InstanceService } from "app/shared/services/instance.service";

@Injectable()
export class ProductListService {
    productService: IProductListService;
    
    /**
     * decides the service to be used as per environment variable
     * @param  {InstanceService} privateinstanceService
     */
    constructor(private instanceService: InstanceService) {
        this.productService = this.instanceService.getInstance((environment.needMock) ?
            ProductListMockService : ProductListApiService);
    }
    
    /**
     * @returns List of products as observable
     */
    getProductList(): Observable<any> {
        return this.productService.getProductList();
    }
}

export interface IProductListService {
    getProductList(): Observable<any>;
}