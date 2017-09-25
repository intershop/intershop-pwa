// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { async } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';
// import { CacheCustomService } from '../../../services/cache/cache-custom.service';
// import { Category } from '../../../services/categories/categories.model';
// import { CategoriesService } from '../../../services/categories/categories.service';
// import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
// import { HeaderNavigationComponent } from './header-navigation.component';


// describe('Header Navigation Component', () => {
//   let fixture: ComponentFixture<HeaderNavigationComponent>;
//   let component: HeaderNavigationComponent;
//   let element: HTMLElement;
//   let cacheCustomServiceMock: CacheCustomService;
//   let categoriesServiceMock: CategoriesService;
//   let routerMock: Router;
//   let localize: LocalizeRouterService;

//   beforeEach(async(() => {
//     cacheCustomServiceMock = mock(CacheCustomService);
//     categoriesServiceMock = mock(CategoriesService);
//     routerMock = mock(Router);
//     localize = mock(LocalizeRouterService);
//     when(categoriesServiceMock.getCategories(anyString())).thenReturn(Observable.of([new Category()]));

//     TestBed.configureTestingModule({
//       declarations: [
//         HeaderNavigationComponent
//       ],
//       providers: [
//         { provide: CacheCustomService, useFactory: () => instance(cacheCustomServiceMock) },
//         { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
//         { provide: Router, useFactory: () => instance(routerMock) },
//         { provide: LocalizeRouterService, useFactory: () => instance(localize) }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(HeaderNavigationComponent);
//     component = fixture.componentInstance;
//     element = fixture.nativeElement;
//   });

//   it('should be created', async(() => {
//     expect(component).toBeTruthy();
//     expect(element).toBeTruthy();
//   }));

//   it(`should call cacheKeyExists method when key doesn't exists and verify that categoryService's getCategories method is being called`, () => {
//     fixture.detectChanges();
//     when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(false);
//     verify(cacheCustomServiceMock.cacheKeyExists(anything())).once();
//     verify(categoriesServiceMock.getCategories(anything())).once();
//     verify(cacheCustomServiceMock.storeDataToCache(anything(), anything())).once();
//   });

//   it(`should call cacheKeyExists method when key exists and verify that cacheCustomService's getCachedData method is being called`, () => {
//     when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(true);
//     fixture.detectChanges();
//     verify(cacheCustomServiceMock.cacheKeyExists(anything())).once();
//     verify(cacheCustomServiceMock.getCachedData(anything())).once();
//   });

//   it(`should call changeRoute method and verify if router.navigate is being called`, () => {
//     const category = {
//       id: 1
//     };
//     const subCategory = {
//       id: 1,
//       hasOnlineSubCategories: true
//     };
//     component.subcategoryLevel = 2;
//     component.changeRoute(category, subCategory);
//     verify(cacheCustomServiceMock.storeDataToCache(anything(), anything())).once();
//     verify(routerMock.navigate(anything())).once();
//     verify(localize.translateRoute(anything())).once();
//   });
// });

