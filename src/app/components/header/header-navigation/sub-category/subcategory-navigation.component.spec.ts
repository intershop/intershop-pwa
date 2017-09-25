import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { anyString, anything, instance, mock, verify } from 'ts-mockito';
import { CacheCustomService } from '../../../../services/index';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
import { SubCategoryNavigationComponent } from './subcategory-navigation.component';

describe('SubCategory Navigation Component', () => {
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let component: SubCategoryNavigationComponent;
  let cacheCustomServiceMock: CacheCustomService;
  let routerMock: Router;
  let localizeServiceMock: LocalizeRouterService;

  beforeEach(async(() => {
    cacheCustomServiceMock = mock(CacheCustomService);
    routerMock = mock(Router);
    localizeServiceMock = mock(LocalizeRouterService);

    TestBed.configureTestingModule({
      declarations: [
        SubCategoryNavigationComponent
      ],
      providers: [
        { provide: CacheCustomService, useFactory: () => instance(cacheCustomServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should call navigate method and verify if router.navigate is called`, () => {
    const subCategory = {
      uri: 'INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/categoriesCameras-Camcorders/585',
      hasOnlineSubCategories: true
    };
    component.navigate(subCategory);
    verify(cacheCustomServiceMock.storeDataToCache(anything(), anyString())).once();
    verify(routerMock.navigate(anything())).once();
    verify(localizeServiceMock.translateRoute(anything())).once();
  });
});

