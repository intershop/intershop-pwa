import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock } from 'ts-mockito';
import { CategoriesService } from '../../services/categories/categories.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { CategoryListComponent } from './category-list.component';

describe('Category List Component', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoriesServiceMock: CategoriesService;
  let localizeServiceMock: LocalizeRouterService;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    localizeServiceMock = mock(LocalizeRouterService);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [CategoryListComponent],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeServiceMock) }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
