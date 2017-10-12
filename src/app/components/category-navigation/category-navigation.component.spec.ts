import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { MockComponent } from '../mock.component';
import { CategoryNavigationComponent } from './category-navigation.component';
import { SubCategoryNavigationComponent } from './subcategory-navigation/subcategory-navigation.component';

fdescribe('Category Navigation Component', () => {
  let component: CategoryNavigationComponent;
  let fixture: ComponentFixture<CategoryNavigationComponent>;
  let categoriesServiceMock: CategoriesService;
  const category: Category = new Category();

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    const activatedRoute = {
      snapshot: {
        url: ['']
      },
      data: Observable.of({ category: '' })

    };

    TestBed.configureTestingModule({
      declarations: [CategoryNavigationComponent,
        MockComponent({ selector: 'is-subcategory-navigation', template: 'Subcategory Navigation Template' })],
      imports: [RouterTestingModule],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CategoryNavigationComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should be created', () => {
    when(categoriesServiceMock.getCategory(anything())).thenReturn(Observable.of(category));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
