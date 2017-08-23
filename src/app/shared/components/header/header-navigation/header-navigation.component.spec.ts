import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { HeaderNavigationService } from './header-navigation-service/header-navigation.service';
import { CategoriesMock, SubCategoriesMock } from './header-navigation-mock';
import { CacheCustomService } from '../../../../shared/services/cache/cache-custom.service';
import { async, inject } from '@angular/core/testing';

describe('Header Navigation Component', () => {
    let fixture: ComponentFixture<HeaderNavigationComponent>,
        component: HeaderNavigationComponent,
        element: HTMLElement,
        keyExists = false;

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
        element = fixture.nativeElement;
    })

    it('should create the component', async(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should call ngOnInt and verify if categories has got data', () => {
        component.ngOnInit();
        expect(component.categories).not.toBeNull();
    });

    it('should call getSubCategories method and get data from HeaderNavigation Service', inject([HeaderNavigationService], (headerNavigationService: HeaderNavigationService) => {
        const headerNavigationServiceSpy = spyOn(headerNavigationService, 'getSubCategories').and.returnValue(Observable.of(CategoriesMock));
        component.getSubCategories('Cameras');
        expect(headerNavigationServiceSpy).toHaveBeenCalled();
        expect(component.subCategories).not.toBeNull();
    })
    );

    it('should call getSubCategories method and get data from CacheCustom Service', inject([CacheCustomService], (cacheCustomService: CacheCustomService) => {
        keyExists = true;
        const cacheCustomServiceSpy = spyOn(cacheCustomService, 'getCachedData').and.returnValue(Observable.of(SubCategoriesMock));
        component.getSubCategories('Cameras');
        expect(cacheCustomServiceSpy).toHaveBeenCalled();
        expect(component.subCategories).not.toBeNull();
    })
    )

    it('should check if categories are rendered on template', () => {
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

