import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TestBed, async } from '@angular/core/testing';
import { FamilyPageListComponent } from './family-page-list.component';
import { ProductList } from '../../../services/products/products.mock';
import { ProductListService, ProductListMockService } from '../../../services/products';
import { InstanceService } from '../../../services/instance.service';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';
import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from '../../../services/cache/encrypt-decrypt.service';
import { environment } from '../../../../environments/environment';

describe('FamilyPageList Component', () => {
  let fixture: ComponentFixture<FamilyPageListComponent>;
  let component: FamilyPageListComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;
  let keyExists = false;

  class MockCacheCustomService {
    cacheKeyExists(key) {
      return keyExists;
    }
    getCachedData(key, isDecrypyted) {
      return ProductList;
    }
    storeDataToCache(data, key, shouldEncrypt) {
      return true;
    }
  }

  class MockProductListService {
    getProductList() {
      return Observable.of(ProductList);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyPageListComponent],
      providers: [InstanceService, ProductListMockService, CacheService,
        EncryptDecryptService,
        { provide: ProductListService, useClass: MockProductListService },
        { provide: CacheCustomService, useClass: MockCacheCustomService }
      ],
      schemas: [NO_ERRORS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPageListComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
  });

  it('should call ngOnInit for 1st time and gets data from Productlist Service', () => {
    fixture.detectChanges();
    expect(component.thumbnails).not.toBeNull();
  });


  it('should call ngOnInit for 2nd time and gets data from Cache Service', () => {
    keyExists = true;
    fixture.detectChanges();
    expect(component.thumbnails).not.toBeNull();
  });

    it('should call ngOnInit when needMock variable is set to false', () => {
    keyExists = false;
    environment.needMock = false;
    fixture.detectChanges();
    expect(component.thumbnails).not.toBeNull();
    environment.needMock = true;
  });

  it('should sort data in descending order', () => {
    component.thumbnails = ProductList[0].Cameras;
    component.sortBy = 'name-desc';
    component.ngOnChanges();
    expect(component.thumbnails[0].name).toBe('Sony LED-2412');
  });

  it('should sort data in ascending order', () => {
    component.thumbnails = ProductList[0].Cameras;
    component.sortBy = 'name-asc';
    component.ngOnChanges();
    expect(component.thumbnails[0].name).toBe('Dicota');
  });

  // it('should check if the data is being rendered on the page', () => {
  //   fixture.detectChanges();
  //   const thumbs = fixture.debugElement.queryAll(By.css('is-product-tile'));
  //   expect(thumbs.length).toBe(5);
  // });
});
