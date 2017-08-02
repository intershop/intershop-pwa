import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TestBed, inject, async } from '@angular/core/testing';
import { FamilyPageListComponent } from './familyPageList.component';
import { ProductList } from '../../../pages/familyPage/familyPage.mock';
import { By } from '@angular/platform-browser';
import { ProductListService, ProductListMockService } from 'app/pages/familyPage/familyPageList/productListService';
import { InstanceService } from '../../../shared/services/instance.service';
import { CacheCustomService } from '../../../shared/services/cache/cacheCustom.service';
import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from '../../../shared/services/cache/encryptDecrypt.service';

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
        component.thumbnails = [
            { Brand: 'Apple' },
            { Brand: 'Nokia' },
            { Brand: 'Xiaomi' },
            { Brand: 'Blackberry' },
            { Brand: 'Apple' },
            { Brand: 'Zara' }
        ];
        component.sortBy = 'name-desc';
        component.ngOnChanges();
        expect(component.thumbnails[0].Brand).toBe('Zara');
    })

    it('should sort data in ascending order', () => {
        component.thumbnails = [
            { Brand: 'Zara' },
            { Brand: 'Apple' },
            { Brand: 'Nokia' },
            { Brand: 'Xiaomi' },
            { Brand: 'Blackberry' },
            { Brand: 'Apple' }
        ];
        component.sortBy = 'name-asc';
        component.ngOnChanges();
        expect(component.thumbnails[0].Brand).toBe('Apple');
    })

    it('should not sort the data', () => {
        component.thumbnails = [
            { Brand: 'Zara' },
            { Brand: 'Apple' },
            { Brand: 'Nokia' },
            { Brand: 'Xiaomi' },
            { Brand: 'Blackberry' },
            { Brand: 'Apple' }
        ];
        component.sortBy = 'default';
        component.ngOnChanges();
        expect(component.thumbnails[0].Brand).toBe('Zara');
    })

    it('should check if the data is being rendered on the page', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const thumbs = fixture.debugElement.queryAll(By.css('is-producttile'));
        expect(thumbs.length).toBe(4);
    });

});
