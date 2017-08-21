import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { HeaderNavigationService } from './header-navigation-service/header-navigation.service';
import { CategoriesMock, SubCategoriesMock } from './header-navigation-mock';
import { CacheCustomService } from '../../../../shared/services/cache/cache-custom.service';
import { async } from '@angular/core/testing';

describe('Header Navigation Component', () => {
    let fixture: ComponentFixture<HeaderNavigationComponent>,
        component: HeaderNavigationComponent,
        element: HTMLElement,
        debugEl: DebugElement;
    let keyExists = false;

    class CacheCustomServiceStub {
        cacheKeyExists(categoryId) {
            return keyExists;
        }
        getCachedData(categoryId) {
            return SubCategoriesMock;
        }
        storeDataToCache(subCategories, categoryId) {
            return true;
        }
    }

    class HeaderNavigationServiceStub {
        constructor() { }
        getCategories(): Observable<any> {
            return Observable.of(CategoriesMock);
        }
        getSubCategories(categoryId): Observable<any> {
            return Observable.of(SubCategoriesMock);
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderNavigationComponent
            ],
            providers: [
                { provide: CacheCustomService, useClass: CacheCustomServiceStub },
                { provide: HeaderNavigationService, useClass: HeaderNavigationServiceStub }
            ]
        })
            .compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderNavigationComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    })

    it('should set values data to categories', () => {
        fixture.detectChanges();
        expect(component.categories).not.toBeNull();
    });

    it('should call getSubCategories method and get data from HeaderNavigation Service', () => {
        component.getSubCategories('Cameras');
        expect(component.subCategories).not.toBeNull();
    });

    it('should call getSubCategories method and get data from CacheCustom Service', () => {
        keyExists = true;
        component.getSubCategories('Cameras');
        expect(component.subCategories).not.toBeNull();
    });

    it('should render categories and subcategories on template', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const categories = element.getElementsByClassName('dropdown');
        const subCategories = element.getElementsByClassName('main-navigation-level1-item');
        expect(categories[0].children[0].textContent).toContain('CAMERAS');
        expect(categories[1].children[0].textContent).toContain('COMPUTERS');
        expect(categories[2].children[0].textContent).toContain('HOME ENTERTAINMENT');
        expect(categories[3].children[0].textContent).toContain('SPECIALS');
    });
});

