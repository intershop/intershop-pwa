import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductTileComponent } from './product-tile.component';
import { async, inject } from '@angular/core/testing';
import { ProductList } from '../../services/products/products.mock';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

import { JwtService } from '../../services/jwt.service';
import { GlobalState } from '../../services/global.state';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { Observable } from 'rxjs/Observable';
import { DisableIconDirective } from '../../directives/disable-icon.directive';


describe('ProductTile Component', () => {
    let fixture: ComponentFixture<ProductTileComponent>;
    let component: ProductTileComponent;
    let element: HTMLElement;
    let debugEl: DebugElement;
    let jwtToken: boolean;

    class JwtServiceStub {
        saveToken(token) {
            jwtToken = token;
            return token;
        }
        getToken() {
            return jwtToken;
        }
    }
    class RouterStub {
        navigate(url) {
            return url;
        }
    }

    class WishListServiceStub {
        getWishList() {
            return Observable.of(null);
        }
    }


    class GlobalStateStub {
        subscribeCachedData(key, callBack: Function) {
            callBack(['12', '23']);
        }

        notifyDataChanged(key, data: [string]) {

        }
    }

    class CacheCustomServiceStub {
        getCachedData(productCompareKey) {
            return ['123', '21'];
        }

        storeDataToCache(item, key) {

        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(),
                RouterTestingModule
            ],
            declarations: [ProductTileComponent, DisableIconDirective],
            providers: [
                { provide: JwtService, useClass: JwtServiceStub },
                { provide: Router, useClass: RouterStub },
                { provide: WishListService, useClass: WishListServiceStub },
                { provide: GlobalState, useClass: GlobalStateStub },
                { provide: CacheCustomService, useClass: CacheCustomServiceStub }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

    }));

    beforeEach(() => {
        TranslateModule.forRoot();
        fixture = TestBed.createComponent(ProductTileComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should call ngOnInit', () => {
        environment.needMock = false;
        component.mockData = ProductList[0].Cameras[0];
        component.ngOnInit();
        expect(component.mockData).not.toBeNull();
        environment.needMock = false;
    });

    xit('should call AddToCompare method and hence notifyDataChanged method of GlobalState', async(inject([GlobalState], (globalState: GlobalState) => {
        const spy = spyOn(globalState, 'notifyDataChanged');
        component.addToCompare('add to Compare');
        expect(spy).toHaveBeenCalled();
    })
    ));
    it('should call AddToCart and hence notifyDataChanged method of GlobalState', async(inject([GlobalState], (globalState: GlobalState) => {
        const spy = spyOn(globalState, 'notifyDataChanged');
        component.addToCart('add to cart');
        expect(spy).toHaveBeenCalled();
    })
    ));

    it('should call addToWishList method and verify if router.navigate is called', async(inject([Router], (router: Router) => {
        const routerSpy = spyOn(router, 'navigate');
        component.addToWishList(null);
        expect(routerSpy).toHaveBeenCalled();
    })
    ));

    it('should call addToWishList method and verify if getWishList method of Wishlistservice is called', async(inject([WishListService], (wishListService: WishListService) => {
        jwtToken = true;
        const wishListSpy = spyOn(wishListService, 'getWishList').and.returnValue(Observable.of(null));
        component.addToWishList(null);
        expect(wishListSpy).toHaveBeenCalled();
    })
    ));

    it('should call calculateAverageRating and satisfy all conditions', () => {
        component.mockData = ProductList[0].Cameras[0];
        component.ngOnInit();
        component.mockData.averagRating = 0.5;
        component.calculateAverageRating();
        expect(component.mockData.averageRatingClass).toEqual('rating-one');

        component.mockData.averagRating = 2.0;
        component.calculateAverageRating();
        expect(component.mockData.averageRatingClass).toEqual('rating-two');

        component.mockData.averagRating = 3.0;
        component.calculateAverageRating();
        expect(component.mockData.averageRatingClass).toEqual('rating-three');

        component.mockData.averagRating = 4.0;
        component.calculateAverageRating();
        expect(component.mockData.averageRatingClass).toEqual('rating-four');

        component.mockData.averagRating = 4.6;
        component.calculateAverageRating();
        expect(component.mockData.averageRatingClass).toEqual('rating-five');

        component.mockData.averagRating = -3.5;
        component.calculateAverageRating();
        expect(component.mockData.averageRatingClass).toEqual('');
    });


    it('should call calculatePriceParameters and satisfy all conditions', () => {
        component.mockData = ProductList[0].Cameras[0];
        component.ngOnInit();
        component.mockData.showInformationalPrice = true;
        component.mockData.isEndOfLife = false;
        component.mockData.listPrice.value = 12;
        component.mockData.salePrice.value = 10;
        component.calculatePriceParameters();
        expect(component.finalPrice).toEqual(0);
        expect(component.greaterPrice).toEqual(0);

        component.mockData.listPrice.value = 10;
        component.mockData.salePrice.value = 12;
        component.calculatePriceParameters();
        expect(component.displayCondition).toEqual(false);

        component.mockData.listPrice.range = {};
        component.mockData.listPrice.range.minimumPrice = 100;
        component.mockData.listPrice.range.maximumPrice = 200;
        component.calculatePriceParameters();
        expect(component.oldPrice).toBe(100);

        component.mockData.listPrice.range = {};
        component.mockData.listPrice.range.minimumPrice = 100;
        component.mockData.listPrice.range.maximumPrice = 100;
        component.mockData.listPrice.value = 15;
        component.mockData.isProductMaster = true;
        component.calculatePriceParameters();
        expect(component.oldPrice).toBe('100');

        component.mockData.listPrice.range = {};
        component.mockData.listPrice.range.minimumPrice = 100;
        component.mockData.listPrice.range.maximumPrice = 100;
        component.mockData.listPrice.value = 15;
        component.mockData.isProductMaster = true;
        component.calculatePriceParameters();
        expect(component.oldPrice).toBe('100');

        component.mockData.listPrice.range = {};
        component.mockData.listPrice.range.minimumPrice = 100;
        component.mockData.listPrice.range.maximumPrice = 100;
        component.mockData.listPrice.value = 15;
        component.mockData.isProductMaster = false;
        component.calculatePriceParameters();
        expect(component.oldPrice).toBe('15');

        component.mockData.listPrice.range = {};
        component.mockData.listPrice.range.minimumPrice = 100;
        component.mockData.listPrice.range.maximumPrice = 100;
        component.mockData.listPrice.value = null;
        component.mockData.isProductMaster = false;
        component.calculatePriceParameters();
        expect(component.oldPrice).toBe('N/A');
    });

    /*    it('should test if the tags are getting rendered', () => {
           component.mockData = ProductList[0].Cameras[0];
           fixture.detectChanges();
           expect(element.getElementsByTagName('img')).toBeDefined();
           const elem = element.getElementsByClassName('rating-display clearfix');
           expect(elem[0].children.length).toBe(7);
       }); */
});
