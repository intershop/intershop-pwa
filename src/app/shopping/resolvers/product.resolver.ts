import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../models/product/product.model';
import { ProductsService } from '../services/products/products.service';

@Injectable()
export class ProductResolver implements Resolve<Product> {

  constructor(
    private productsService: ProductsService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const sku = route.paramMap.get('sku');
    // TODO: redirect to /error when product not found
    return this.productsService.getProduct(sku);
  }

}
