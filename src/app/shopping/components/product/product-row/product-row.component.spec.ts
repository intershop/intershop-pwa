import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { async, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { AccountLoginService } from '../../../../core/services/account-login/account-login.service';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ProductCompareService } from '../../../../core/services/product-compare/product-compare.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { WishlistsService } from '../../../../core/services/wishlists/wishlists.service';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';
import { ProductRowComponent } from './product-row.component';

/*
  TODO: commented out tests fail with "ReferenceError: Can't find variable: Intl in vendor.bundle.js (line 56892)"
 */
describe('Product Row Component', () => {
  let fixture: ComponentFixture<ProductRowComponent>;
  let component: ProductRowComponent;
  let element: HTMLElement;
  let productCompareServiceMock: ProductCompareService;
  let cartStatusServiceMock: CartStatusService;
  let wishlistsServiceMock: WishlistsService;
  let accountLoginServiceMock: AccountLoginService;
  let location: Location;

  const productList = [
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
          'showProductRating': true,
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
          'nameOverride': 'Test_override',
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

  beforeEach(async(() => {
    productCompareServiceMock = mock(ProductCompareService);
    when(productCompareServiceMock.getValue()).thenReturn([]);
    cartStatusServiceMock = mock(CartStatusService);
    when(cartStatusServiceMock.getValue()).thenReturn([]);
    wishlistsServiceMock = mock(WishlistsService);
    accountLoginServiceMock = mock(AccountLoginService);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(),
      RouterTestingModule.withRoutes([
        { path: 'login', component: ProductRowComponent }
      ])
      ],
      declarations: [ProductRowComponent, DisableIconDirective],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: WishlistsService, useFactory: () => instance(wishlistsServiceMock) },
        { provide: ProductCompareService, useFactory: () => instance(productCompareServiceMock) },
        { provide: CartStatusService, useFactory: () => instance(cartStatusServiceMock) },
        { provide: ICM_BASE_URL, useValue: 'http://www.example.org' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    TranslateModule.forRoot();
    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.get(Location);
  });

  it('should modify mockData when received', () => {
    component.mockData = productList[0].Cameras[0];
    fixture.detectChanges();
    expect(component.mockData).not.toBeNull();
  });

  it('should call service when item added to compare', () => {
    component.mockData = productList[0].Cameras[0];
    component.addToCompare();
    verify(productCompareServiceMock.addSKU(anything())).once();
  });

  it('should call service when added to cart', () => {
    component.mockData = productList[0].Cameras[0];
    component.addToCart();
    verify(cartStatusServiceMock.addSKU(anything())).once();
  });

  it('should call addToWishlist method and verify if router.navigate is called', async(() => {
    expect(location.path()).toBe('');
    component.addToWishlist();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/login');
    });
    verify(wishlistsServiceMock.update()).never();
  }));

  it('should call addToWishlist method and verify if getWishlist method of WishlistsService is called', async(inject([WishlistsService], (wishlistsService: WishlistsService) => {
    when(accountLoginServiceMock.isAuthorized()).thenReturn(true);
    component.addToWishlist();
    verify(wishlistsServiceMock.update()).once();
  })
  ));

  it('should set averageRatingClass based on averageRating passed', () => {
    component.mockData = productList[0].Cameras[0];
    fixture.detectChanges();
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


  it('should set finalPrice,greaterPrice,displayCondition and oldPrice based on mockData', () => {
    component.mockData = productList[0].Cameras[0];
    fixture.detectChanges();
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

  it('should test if the tags are getting rendered', () => {
    component.mockData = productList[0].Cameras[0];
    fixture.detectChanges();
    expect(element.getElementsByTagName('img')).toBeTruthy();
    const elem = element.getElementsByClassName('rating-display clearfix');
    expect(elem[0].children.length).toBe(7);
  });
});
