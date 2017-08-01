import { Injectable } from '@angular/core';
import { InstanceService } from '../../../../shared/services/instance.service';
import { environment } from '../../../../../environments/environment.prod';
import { ProductListMockService, ProductListApiService } from './index';
import { Observable } from 'rxjs/Observable';
import { ProductList } from '../../familyPage.mock';

@Injectable()
export class ProductListService {
  productService: IProductListService;

  /**
   * Decides the service to be used as per environment variable
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
