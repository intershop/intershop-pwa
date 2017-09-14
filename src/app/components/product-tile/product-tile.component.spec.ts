import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductTileComponent } from './product-tile.component';
import { async, inject } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { JwtService, GlobalState, CacheCustomService } from '../../services';
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
    const ProductList = [
        {
            Cameras: [
                {
                    'name': 'Lenco',
                    'type': 'Product',
                    'attributes': [
                        {
                            'name': 'Component video (YPbPr/YCbCr) in',
                            'type': 'String',
                            'value': '1'
                        }
                    ],
                    'shortDescription': 'LED-2412 - 60.96 cm (24 ) LED, 1920 x 1080, 16:9, DVB-T',
                    'minOrderQuantity': 1,
                    'longDescription': '- 61 (24”) 16:9 LED display. - Full HD (1920 x 1080 pixels).- DVB-T function. - Common Interface (CI). - Personal video recorder. - Supports analogue and cable TV. - Multi TV system: PAL & SECAM. - Supports NICAM stereo. - Multiple OSD languages. - Electronic Program Guide (EPG). - Teletext. - Sleeptimer. - Built-in Stereospeakers 3W. - Suitable for wall  ounting (VESA 100).',
                    'productMaster': false,
                    'listPrice':
                    {
                        'type': 'ProductPrice',
                        'value': 375.24,
                        'currencyMnemonic': 'USD',
                        'range': {
                            'minimumPrice': 110,
                            'maximumPrice': 440
                        }
                    },
                    'productBundle': false,
                    'shippingMethods':
                    [
                        {
                            'name': '2-Business Day',
                            'type': 'ShippingMethod',
                            'id': 'STD_2DAY',
                            'shippingTimeMin': 1,
                            'shippingTimeMax': 2
                        }
                    ],
                    'availableWarranties':
                    [
                        {
                            'type': 'Link',
                            'description': 'Insurance against breakdown. Warranty period: 1 year.',
                            'title': '1-year LED TV Support',
                            'uri': 'inSPIRED-inTRONICS-Site/-/products/1YLEDTVSUP',
                            'attributes':
                            [
                                {
                                    'name': 'WarrantyPrice',
                                    'type': 'MoneyRO',
                                    'value':
                                    {
                                        'type': 'Money',
                                        'value': 106,
                                        'currencyMnemonic': 'USD'
                                    }
                                }
                            ]
                        }
                    ],
                    'productName': 'Lenco LED-2412',
                    'roundedAverageRating': '0.0',
                    'readyForShipmentMin': 3,
                    'readyForShipmentMax': 7,
                    'salePrice':
                    {
                        'type': 'ProductPrice',
                        'value': 122,
                        'currencyMnemonic': 'USD',
                        'scaledPrices': []
                    },
                    'sku': '8706917',
                    'images':
                    [
                        {
                            'name': 'front S',
                            'type': 'Image',
                            'imageActualHeight': 110,
                            'imageActualWidth': 110,
                            'viewID': 'front',
                            'effectiveUrl': '../../assets/product_img/a.jpg',
                            'typeID': 'S',
                            'primaryImage': true
                        },
                        {
                            'name': 'front S',
                            'type': 'Image',
                            'imageActualHeight': 110,
                            'imageActualWidth': 110,
                            'viewID': 'front',
                            'effectiveUrl': '../../assets/product_img/a.jpg',
                            'typeID': 'S',
                            'primaryImage': true
                        },
                        {
                            'name': 'front S',
                            'type': 'Image',
                            'imageActualHeight': 110,
                            'imageActualWidth': 110,
                            'viewID': 'front',
                            'effectiveUrl': '../../assets/product_img/a.jpg',
                            'typeID': 'S',
                            'primaryImage': true
                        }
                    ],
                    'manufacturer': 'Lenco',
                    'availability': true,
                    'retailSet': false,
                    'inStock': true,
                    'mastered': false,

                    'enableExpressShop': true,
                    'richSnippetsEnabled': true,
                    'ShowProductRating': true,
                    'showAddToCart': true,
                    'totalRatingCount': 2,
                    'simpleRatingView': true,
                    'averagRating': 2,
                    'isRetailSet': true,
                    'displayType': 'glyphicon',
                    'applicablePromotions': [
                        {
                            'disableMessages': true,
                            'isUnderABTest': true,
                            'title': 'Promotion Test Title',
                            'icon': 'test',
                            'externalDetailsUrl': 'www.testUrl.com'
                        }
                    ],
                    'name_override': 'Test_override',
                    'mockListView': {
                        'displayType': 'test',
                        'isRetailSet': false
                    },
                    'showInformationalPrice': true,
                    'isEndOfLife': false,
                    'id': '1',
                    'averageRatingClass': '',
                    'isProductMaster': true
                }
            ]
        }
    ];

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
