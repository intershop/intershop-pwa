import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TestBed } from '@angular/core/testing';
import { FilterListComponent } from './filter-list.component';
import { data } from './filter-list-service/filter-list.mock';
import { CacheCustomService } from 'app/services/cache/cache-custom.service';
import { FilterListService, FilterListMockService } from './filter-list-service';
import { InstanceService } from 'app/services/instance.service';
import { CollapseModule } from 'ngx-bootstrap/collapse';
describe('FilterList Component', () => {
    let fixture: ComponentFixture<FilterListComponent>;
    let component: FilterListComponent;
    let element: HTMLElement;
    let debugEl: DebugElement;
    let keyExists = false;

    class CacheCustomServiceStub {
        cacheKeyExists(key) {
            return keyExists;
        }
        getCachedData(key, isDecrypyted) {
            return data
        }
        storeDataToCache(data, key, shouldEncrypt) {
            return true
        }
    }
    class FilterListServiceStub {
        getSideFilters() {
            return Observable.of(data)
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FilterListComponent],
            imports: [CollapseModule],
            providers: [
                { provide: FilterListService, useClass: FilterListServiceStub },
                { provide: CacheCustomService, useClass: CacheCustomServiceStub },
                InstanceService, FilterListMockService
            ]

        });
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterListComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    })


    it('should call ngOnInit for 1st time and gets data from Category Service', () => {
        component.ngOnInit();
        expect(component.filterListData).not.toBeNull();
    })

    it('should call ngOnInit for 2nd time and gets data from Cache Service', () => {
        keyExists = true;
        component.ngOnInit();
        expect(component.filterListData).not.toBeNull();
    })

    it('should check if Categories are getting rendered on page', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const categories = element.getElementsByTagName('h3');
        expect(categories.length).toBe(4);
        expect(categories[0].textContent).toContain('Category');
        expect(categories[1].textContent).toContain('Brand');
        expect(categories[2].textContent).toContain('Price');
        expect(categories[3].textContent).toContain('Color');
    })

});
