import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock } from 'ts-mockito';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { CategoriesService } from '../../../../shared/services/categories/categories.service';
import { CategoryListComponent } from './category-list.component';

describe('Category List Component', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoriesServiceMock: CategoriesService;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [CategoryListComponent],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ICM_BASE_URL, useValue: 'http://www.example.org' }
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
