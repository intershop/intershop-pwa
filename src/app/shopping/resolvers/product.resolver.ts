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
    let sku: string = null;
    if (route.paramMap && route.paramMap.get('sku')) {
      sku = route.paramMap.get('sku');
    } else {
      sku = route.url[route.url.length - 1].path;
    }
    // TODO: redirect to /error when product not found
    return sku ? this.productsService.getProduct(sku) : null;
  }

}
