import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { async } from '@angular/core/testing';
import { mock, instance, when, anything, verify } from 'ts-mockito';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryService } from '../../../services/categories/category.service';
import { CategoriesMock, SubCategoriesMock } from '../../../services/categories/categories.mock';
import { CacheCustomService } from '../../../services';
import { CategoryModel } from '../../../services/categories/category.model';
import { SubcategoryModel } from '../../../services/categories/subcategory.model';

describe('Header Navigation Component', () => {
    let fixture: ComponentFixture<HeaderNavigationComponent>;
    let component: HeaderNavigationComponent;
    let element: HTMLElement;
    let cacheCustomServiceMock: CacheCustomService;
    let categoryServiceMock: CategoryService;

    beforeEach(async(() => {
        cacheCustomServiceMock = mock(CacheCustomService);
        when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(false);
        when(cacheCustomServiceMock.getCachedData('Cameras')).thenReturn(SubCategoriesMock[0]);

        categoryServiceMock = mock(CategoryService);
        when(categoryServiceMock.getCategories()).thenReturn(Observable.of(CategoriesMock as CategoryModel));
        when(categoryServiceMock.getSubCategories('Cameras')).thenReturn(Observable.of(SubCategoriesMock[0] as SubcategoryModel));

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [
                HeaderNavigationComponent
            ],
            providers: [
                { provide: CacheCustomService, useFactory: () => instance(cacheCustomServiceMock) },
                { provide: CategoryService, useFactory: () => instance(categoryServiceMock) }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderNavigationComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should be created', async(() => {
        expect(component).toBeTruthy();
        expect(element).toBeTruthy();
    }));

    it('should initialized with categories when created', () => {
        fixture.detectChanges();

        expect(component.categories).toBeTruthy();
        expect(component.categories.elements.length).toBeGreaterThan(0);
    });

    it('should render mocked category data on template', () => {
        fixture.detectChanges();

        const categories = element.getElementsByClassName('dropdown');
        expect(categories[0].children[0].textContent).toContain('Cameras');
        expect(categories[1].children[0].textContent).toContain('Computers');
        expect(categories[2].children[0].textContent).toContain('Home Entertainment');
        expect(categories[3].children[0].textContent).toContain('Specials');
    });

    it('should get Subcategories data from Category Service when no cache is available', () => {
        component.getSubCategories('Cameras');

        verify(categoryServiceMock.getSubCategories(anything())).once();
        verify(cacheCustomServiceMock.getCachedData(anything())).never();
        expect(component.subCategories).toBeTruthy();
        expect(component.subCategories.subCategories.length).toBeGreaterThan(0);
    });

    it('should get Subcategories data from CacheCustom Service if available', () => {
        when(cacheCustomServiceMock.cacheKeyExists('Cameras')).thenReturn(true);
        component.getSubCategories('Cameras');

        verify(categoryServiceMock.getSubCategories(anything())).never();
        verify(cacheCustomServiceMock.getCachedData(anything())).once();
        expect(component.subCategories).toBeTruthy();
        expect(component.subCategories.subCategories.length).toBeGreaterThan(0);
    });
});

