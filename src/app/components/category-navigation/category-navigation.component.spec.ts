import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { MockComponent } from '../mock.component';
import { CategoryNavigationComponent } from './category-navigation.component';

describe('Category Navigation Component', () => {
  let component: CategoryNavigationComponent;
  let fixture: ComponentFixture<CategoryNavigationComponent>;
  let categoriesServiceMock: CategoriesService;
  let category: Category;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    category = new Category();
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
      when(categoriesServiceMock.getCategory(anything())).thenReturn(Observable.of(category));
    });
  }));

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call CategoriesService.getCategory', () => {
    fixture.detectChanges();
    verify(categoriesServiceMock.getCategory(anything())).once();
  });
});
