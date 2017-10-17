import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { CacheService } from 'ng2-cache/ng2-cache';
import { Observable } from 'rxjs/Rx';
import { anyString, anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { environment } from '../../../environments/environment';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { EncryptDecryptService } from '../../services/cache/encrypt-decrypt.service';
import { ProductListService } from '../../services/products/products.service';
import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
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
              'effectiveUrl': '../../assets/product_img/b.jpg',
              'typeID': 'S',
              'primaryImage': true
            },
            {
              'name': 'front S',
              'type': 'Image',
              'imageActualHeight': 110,
              'imageActualWidth': 110,
              'viewID': 'front',
              'effectiveUrl': '../../assets/product_img/b.jpg',
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
        },
        {
          'name': 'Dicota',
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
              'maximumPrice': 550
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
            },
            {
              'type': 'Link',
              'description': 'Insurance against breakdown. Warranty period: 2 years.',
              'title': '2-year LED TV Support',
              'uri': 'inSPIRED-inTRONICS-Site/-/products/2YLEDTVSUP',
              'attributes':
              [
                {
                  'name': 'WarrantyPrice',
                  'type': 'MoneyRO',
                  'value':
                  {
                    'type': 'Money',
                    'value': 185.5,
                    'currencyMnemonic': 'USD'
                  }
                }
              ]
            },
            {
              'type': 'Link',
              'description': 'Insurance against breakdown. Warranty period: 3 years.',
              'title': '3-year LED TV Support',
              'uri': 'inSPIRED-inTRONICS-Site/-/products/3YLEDTVSUP',
              'attributes':
              [
                {
                  'name': 'WarrantyPrice',
                  'type': 'MoneyRO',
                  'value':
                  {
                    'type': 'Money',
                    'value': 265,
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
            'value': 140,
            'currencyMnemonic': 'USD',
            'scaledPrices': []
          },
          'sku': '8706918',
          'images':
          [
            {
              'name': 'front S',
              'type': 'Image',
              'imageActualHeight': 110,
              'imageActualWidth': 110,
              'viewID': 'front',
              'effectiveUrl': '../../assets/product_img/b.jpg',
              'typeID': 'S',
              'primaryImage': true
            },
            {
              'name': 'front S',
              'type': 'Image',
              'imageActualHeight': 110,
              'imageActualWidth': 110,
              'viewID': 'front',
              'effectiveUrl': '../../assets/product_img/b.jpg',
              'typeID': 'S',
              'primaryImage': true
            },
            {
              'name': 'front S',
              'type': 'Image',
              'imageActualHeight': 110,
              'imageActualWidth': 110,
              'viewID': 'front',
              'effectiveUrl': '../../assets/product_img/b.jpg',
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
          'id': '2',
          'averageRatingClass': '',
          'isProductMaster': true
        }
      ]
    }
  ];
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let element: HTMLElement;
  const cacheServiceMock: CacheCustomService = mock(CacheCustomService);
  const productListServiceMock: ProductListService = mock(ProductListService);
  when(cacheServiceMock.getCachedData(anything(), anything())).thenReturn(ProductList);
  when(productListServiceMock.getProductList()).thenReturn(
    Observable.of(ProductList)
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [CacheService, EncryptDecryptService,
        { provide: ProductListService, useFactory: () => instance(productListServiceMock) },
        { provide: CacheCustomService, useFactory: () => instance(cacheServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should call ngOnInit for 1st time and gets data from Productlist Service', () => {
    when(cacheServiceMock.cacheKeyExists(anyString())).thenReturn(false);
    fixture.detectChanges();
    expect(component.thumbnails).not.toBeNull();
  });


  it('should call ngOnInit for 2nd time and gets data from Cache Service', () => {
    when(cacheServiceMock.cacheKeyExists(anyString())).thenReturn(true);
    fixture.detectChanges();
    expect(component.thumbnails).not.toBeNull();
  });

  it('should call ngOnInit when needMock variable is set to false', () => {
    when(cacheServiceMock.cacheKeyExists(anyString())).thenReturn(false);
    environment.needMock = false;
    fixture.detectChanges();
    expect(component.thumbnails).not.toBeNull();
    environment.needMock = true;
  });

  it('should sort data in descending order', () => {
    component.thumbnails = ProductList[0].Cameras;
    component.sortBy = 'name-desc';
    component.ngOnChanges();
    expect(component.thumbnails[0].name).toBe('Lenco');
  });

  it('should sort data in ascending order', () => {
    component.thumbnails = ProductList[0].Cameras;
    component.sortBy = 'name-asc';
    component.ngOnChanges();
    expect(component.thumbnails[0].name).toBe('Dicota');
  });

  it('should check if the data is being rendered on the page', () => {
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('is-product-tile');
    expect(thumbs.length).toBe(1);
  });
});
