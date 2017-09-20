import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';
import { async } from '@angular/core/testing';
import { mock, instance, when, anything, verify, anyString } from 'ts-mockito';
import { Category } from '../../../services/categories/category.model';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;
  let cacheCustomServiceMock: CacheCustomService;
  let categoriesServiceMock: CategoriesService;
  let routerMock: Router;

  beforeEach(async(() => {
    cacheCustomServiceMock = mock(CacheCustomService);
    categoriesServiceMock = mock(CategoriesService);
    routerMock = mock(Router);
    when(categoriesServiceMock.getCategories(anyString())).thenReturn(Observable.of([new Category()]));

    TestBed.configureTestingModule({
      declarations: [
        HeaderNavigationComponent
      ],
      providers: [
        { provide: CacheCustomService, useFactory: () => instance(cacheCustomServiceMock) },
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

  it(`should call cacheKeyExists method when key doesn't exists and verify that categoryService's getCategories method is being called`, () => {
    fixture.detectChanges();
    when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(false);
    verify(cacheCustomServiceMock.cacheKeyExists(anything())).once();
    verify(categoriesServiceMock.getCategories(anything())).once();
    verify(cacheCustomServiceMock.storeDataToCache(anything(), anything())).once();
  });

  it(`should call cacheKeyExists method when key exists and verify that cacheCustomService's getCachedData method is being called`, () => {
    when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(true);
    fixture.detectChanges();
    verify(cacheCustomServiceMock.cacheKeyExists(anything())).once();
    verify(cacheCustomServiceMock.getCachedData(anything())).once();
  });

  it(`should call changeRoute method and verify if router.navigate is being called`, () => {
    const category = {
      id: 1
    };
    const subCategory = {
      id: 1,
      hasOnlineSubCategories: true
    };
    component.subcategoryLevel = 2;
    component.changeRoute(category, subCategory);
    verify(cacheCustomServiceMock.storeDataToCache(anything(), anything())).once();
    verify(routerMock.navigate(anything())).once();
  });
});

