import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { SubCategoryNavigationComponent } from './subcategory-navigation.component';

describe('SubCategory Navigation Component', () => {
  let component: SubCategoryNavigationComponent;
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let categoriesServiceMock: CategoriesService;
  let localizeServiceMock: LocalizeRouterService;
  let category: Category;
  let categories: Category[];

  beforeEach(async(() => {
    category = new Category();
    categories = new Array<Category>();
    categoriesServiceMock = mock(CategoriesService);
    localizeServiceMock = mock(LocalizeRouterService);
    category.uri = '/categories/Cameras-Camcorders/585';
    TestBed.configureTestingModule({
      declarations: [SubCategoryNavigationComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SubCategoryNavigationComponent);
      component = fixture.componentInstance;
      category.hasOnlineSubCategories = true;
      category.subCategories = categories;
      component.category = category;
      component.currentCategoryUri = 'Computers/06';
      component.category.uri = '/categories/Computers/06';
      when(categoriesServiceMock.getCategory(anything())).thenReturn(Observable.of(category));
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(`should expand if category is selected`, () => {
    fixture.detectChanges();
    expect(component.expanded).toEqual(true);
  });

  it(`should  return true (isCurrentCategory) if current category uri match with category uri`, () => {
    fixture.detectChanges();
    expect(component.isCurrentCategory(component.category)).toEqual(true);
  });

  it('should call CategoriesService.getCategory if subcategories data is not loaded', () => {
    component.category.subCategories = null;
    component.category.hasOnlineSubCategories = true;
    fixture.detectChanges();
    verify(categoriesServiceMock.getCategory(anything())).once();
  });
});
