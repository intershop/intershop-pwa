import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { CategoryService } from 'app/services/categories/category.service';
import { CategoriesMock, SubCategoriesMock } from 'app/services/categories/categories.mock';
import { CacheCustomService } from 'app/services/cache/cache-custom.service';
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

    class CategoryServiceStub {
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
                { provide: CategoryService, useClass: CategoryServiceStub }
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

    it('should call getSubCategories method and get data from Category Service', inject([CategoryService], (categoryService: CategoryService) => {
        const categoryServiceSpy = spyOn(categoryService, 'getSubCategories').and.returnValue(Observable.of(CategoriesMock));
        component.getSubCategories('Cameras');
        expect(categoryServiceSpy).toHaveBeenCalled();
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
        expect(categories[0].children[0].textContent).toContain('Cameras');
        expect(categories[1].children[0].textContent).toContain('Computers');
        expect(categories[2].children[0].textContent).toContain('Home Entertainment');
        expect(categories[3].children[0].textContent).toContain('Specials');
    });
});

