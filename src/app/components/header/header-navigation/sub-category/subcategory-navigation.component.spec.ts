import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
import { SubCategoryNavigationComponent } from './subcategory-navigation.component';

describe('SubCategory Navigation Component', () => {
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let component: SubCategoryNavigationComponent;
  let categoriesServiceMock: CategoriesService;
  let localizeServiceMock: LocalizeRouterService;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    localizeServiceMock = mock(LocalizeRouterService);

    TestBed.configureTestingModule({
      declarations: [
        SubCategoryNavigationComponent
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
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
});
