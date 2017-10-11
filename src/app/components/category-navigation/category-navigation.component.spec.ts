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
  let activatedRoute: ActivatedRoute;
  const category: Category = new Category();

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    activatedRoute = mock(ActivatedRoute);
    TestBed.configureTestingModule({
      declarations: [CategoryNavigationComponent,
        MockComponent({ selector: 'is-subcategory-navigation', template: 'Subcategory Navigation Template' })],
      imports: [RouterTestingModule],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CategoryNavigationComponent);
      component = fixture.componentInstance;
      //  when(categoriesServiceMock.getCurrentRootCategory()).thenReturn(Observable.of(category));
      fixture.detectChanges();
    });
  }));

  it('should be created', () => {
    const url = Array.of(UrlSegment);

    const url1: UrlSegment = new UrlSegment('', {'dsdsds': 'sassasa' });

    when(activatedRoute.snapshot.url).thenReturn('inSPIRED-inTRONICS-Site/-/categories/Computers/106/830/1501');
    expect(component).toBeTruthy();
  });

  // it('should call getCurrentRootCategory', () => {
  //   verify(categoriesServiceMock.getCurrentRootCategory()).once();
  //   expect(component.rootCategory).toEqual(category);
  // });
});
