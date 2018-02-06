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
import { Product } from '../../../../models/product/product.model';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';
import { ProductTileComponent } from './product-tile.component';

/*
  TODO: commented out tests fail with "ReferenceError: Can't find variable: Intl in vendor.bundle.js (line 56892)"
 */
describe('Product Tile Component', () => {
  let fixture: ComponentFixture<ProductTileComponent>;
  let component: ProductTileComponent;
  let element: HTMLElement;
  let productCompareServiceMock: ProductCompareService;
  let cartStatusServiceMock: CartStatusService;
  let wishlistsServiceMock: WishlistsService;
  let accountLoginServiceMock: AccountLoginService;
  let location: Location;
  let product: Product;

  beforeEach(async(() => {
    productCompareServiceMock = mock(ProductCompareService);
    product = new Product('8706917');
    product.name = 'Lenco';
    product.shortDescription = 'LED-2412 - 60.96 cm (24 ) LED, 1920 x 1080, 16:9, DVB-T';
    product.images = [
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': 'test.jpg',
        'typeID': 'S',
        'primaryImage': true
      },
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': 'test.jpg',
        'typeID': 'S',
        'primaryImage': false
      },
      {
        'name': 'front L',
        'type': 'Image',
        'imageActualHeight': 500,
        'imageActualWidth': 500,
        'viewID': 'front',
        'effectiveUrl': 'test.jpg',
        'typeID': 'L',
        'primaryImage': true
      }
    ];
    when(productCompareServiceMock.getValue()).thenReturn([]);
    cartStatusServiceMock = mock(CartStatusService);
    when(cartStatusServiceMock.getValue()).thenReturn([]);
    wishlistsServiceMock = mock(WishlistsService);
    accountLoginServiceMock = mock(AccountLoginService);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(),
      RouterTestingModule.withRoutes([
        { path: 'login', component: ProductTileComponent }
      ])
      ],
      declarations: [ProductTileComponent, DisableIconDirective],
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
    fixture = TestBed.createComponent(ProductTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.get(Location);
  });

  it('should modify product when received', () => {
    component.product = product;
    fixture.detectChanges();
    expect(component.product).not.toBeNull();
  });

  it('should call service when item added to compare', () => {
    component.product = product;
    component.addToCompare();
    verify(productCompareServiceMock.addSKU(anything())).once();
  });

  it('should call service when added to cart', () => {
    component.product = product;
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

  it('should test if product image component is getting rendered', () => {
    component.product = product;
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toBeTruthy();
  });
});
