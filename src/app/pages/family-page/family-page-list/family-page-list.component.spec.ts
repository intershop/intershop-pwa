import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TestBed, inject, async } from '@angular/core/testing';
import { FamilyPageListComponent } from './family-page-list.component';
import { ProductList } from '../../../pages/family-page/family-page.mock';
import { By } from '@angular/platform-browser';
import { ProductListService, ProductListMockService } from 'app/pages/family-page/family-page-list/product-list-service';
import { InstanceService } from '../../../shared/services/instance.service';
import { CacheCustomService } from '../../../shared/services/cache/cache-custom.service';
import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from '../../../shared/services/cache/encrypt-decrypt.service';

describe('FamilyPageList Component', () => {
  let fixture: ComponentFixture<FamilyPageListComponent>,
    component: FamilyPageListComponent,
    element: HTMLElement,
    debugEl: DebugElement,
    keyExists = false;

  class MockDataEmitterService {
    addToCart() {
      return true
    }
  }

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
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPageListComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
  })

  it('should call ngOnInit for 1st time and gets data from Productlist Service', () => {
    component.ngOnInit();
    expect(component.thumbnails).not.toBeNull();
  })


  it('should call ngOnInit for 2nd time and gets data from Cache Service', () => {
    keyExists = true;
    component.ngOnInit();
    expect(component.thumbnails).not.toBeNull();
  })

  it('should sort data in descending order', () => {
    component.thumbnails = ProductList[0].Cameras;
    component.sortBy = 'name-desc';
    component.ngOnChanges();
    expect(component.thumbnails[0].name).toBe('Sony LED-2412');
  })

  it('should sort data in ascending order', () => {
    component.thumbnails = ProductList[0].Cameras;
    component.sortBy = 'name-asc';
    component.ngOnChanges();
    expect(component.thumbnails[0].name).toBe('Dicota');
  })

  // it('should check if the data is being rendered on the page', () => {
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   const thumbs = fixture.debugElement.queryAll(By.css('is-producttile'));
  //   expect(thumbs.length).toBe(5);
  // });
});
