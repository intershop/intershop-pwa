import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';
import { ProductRowComponent } from './product-row.component';

/*
  TODO: commented out tests fail with "ReferenceError: Can't find variable: Intl in vendor.bundle.js (line 56892)"
 */
describe('Product Row Component', () => {
  let fixture: ComponentFixture<ProductRowComponent>;
  let component: ProductRowComponent;
  let element: HTMLElement;
  let cartStatusServiceMock: CartStatusService;

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
    cartStatusServiceMock = mock(CartStatusService);
    when(cartStatusServiceMock.getValue()).thenReturn([]);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductRowComponent, DisableIconDirective],
      providers: [
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
  });

  it('should modify product when received', () => {
    component.product = productList[0].Cameras[0];
    fixture.detectChanges();
    expect(component.product).not.toBeNull();
  });

  it('should call service when added to cart', () => {
    component.product = productList[0].Cameras[0];
    component.addToCart();
    verify(cartStatusServiceMock.addSKU(anything())).once();
  });

  it('should test if the tags are getting rendered', () => {
    component.product = productList[0].Cameras[0];
    fixture.detectChanges();
    expect(element.getElementsByTagName('img')).toBeTruthy();
  });
});
