import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { MockComponent } from '../../mock.component';
import { SubCategoryNavigationComponent } from './subcategory-navigation.component';

fdescribe('SubCategory Navigation Component', () => {
  let component: SubCategoryNavigationComponent;
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let categoriesServiceMock: CategoriesService;
  let localizeServiceMock: LocalizeRouterService;
  const category: Category = new Category();
  const categories: Category[] = new Array<Category>();

  beforeEach(async(() => {
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
      component.selectedCategory = category;
      when(categoriesServiceMock.getCategories(anything())).thenReturn(Observable.of(categories));
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(`should add subcategory`, () => {
    const subCatComp = new SubCategoryNavigationComponent(localizeServiceMock, categoriesServiceMock);
    fixture.detectChanges();
    component.addSubCategory(subCatComp);
    expect(component.childSubCategories.pop()).toEqual(subCatComp);
  });

  it(`should subCategoryClicked`, () => {
    const subCatComp = new SubCategoryNavigationComponent(localizeServiceMock, categoriesServiceMock);
    subCatComp.category = category;
    fixture.detectChanges();
    component.addSubCategory(subCatComp);
    component.subCategoryClicked(category);
  });

  it(`should add to parent category `, () => {
    const parentCategory = new SubCategoryNavigationComponent(localizeServiceMock, categoriesServiceMock);
    component.parentCategory = parentCategory;
    component.addToParent();
    fixture.detectChanges();
    expect(parentCategory.childSubCategories.pop()).toEqual(component);
  });

  it(`should navigate to subcategory `, () => {
    fixture.detectChanges();
    component.navigateToSubcategory(category);
    verify(categoriesServiceMock.setCurrentCategory(anything())).once();
    verify(localizeServiceMock.navigateToRoute(anything())).once();
  });

  it(`should be expanded if selected category`, () => {
    component.selectedCategory = component.category;
    fixture.detectChanges();
    expect(component.expanded).toEqual(true);
  });

  it(`should be expanded if selected category 123`, () => {
    component.selectedCategory = new Category();
    component.selectedCategory.uri = '';
    fixture.detectChanges();
    expect(component.expanded).toEqual(false);
  });

  it(`should get sub categories  from server if subCategories not loaded`, () => {
    component.category.subCategories = null;
    component.category.hasOnlineSubCategories = true;
    fixture.detectChanges();
    verify(categoriesServiceMock.getCategories(anything())).once();
  });
});
