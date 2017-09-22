import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';
import { CategoryModel } from '../../../services/categories/category.model';
import { CategoryService } from '../../../services/categories/category.service';
import { SubcategoryModel } from '../../../services/categories/subcategory.model';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;
  let cacheCustomServiceMock: CacheCustomService;
  let categoryServiceMock: CategoryService;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(async(() => {
    cacheCustomServiceMock = mock(CacheCustomService);

    categoryServiceMock = mock(CategoryService);
    when(categoryServiceMock.getCategories()).thenReturn(Observable.of(new CategoryModel()));
    when(categoryServiceMock.getSubCategories('Cameras')).thenReturn(Observable.of(new SubcategoryModel()));

    localizeRouterServiceMock = mock(LocalizeRouterService);
    when(localizeRouterServiceMock.translateRoute('/category')).thenReturn('/category');
    when(localizeRouterServiceMock.translateRoute('/home')).thenReturn('/home');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        HeaderNavigationComponent
      ],
      providers: [
        { provide: CacheCustomService, useFactory: () => instance(cacheCustomServiceMock) },
        { provide: CategoryService, useFactory: () => instance(categoryServiceMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should initialized with categories when created', () => {
    verify(categoryServiceMock.getCategories()).never();
    fixture.detectChanges();
    verify(categoryServiceMock.getCategories()).once();
  });

  xit('should render mocked category data on template', () => {
    fixture.detectChanges();
    const categories = element.getElementsByClassName('dropdown');
    expect(categories[0].children[0].textContent).toContain('Cameras');
  });

  it('should get Subcategories data from Category Service when no cache is available', () => {
    when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(false);
    component.getSubCategories('Cameras');

    verify(categoryServiceMock.getSubCategories('Cameras')).once();
    verify(cacheCustomServiceMock.getCachedData(anything())).never();
  });

  it('should get Subcategories data from CacheCustom Service if available', () => {
    when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(true);
    component.getSubCategories('cacheKey');
    verify(categoryServiceMock.getSubCategories(anything())).never();
    verify(cacheCustomServiceMock.getCachedData(anything())).once();
  });
});

