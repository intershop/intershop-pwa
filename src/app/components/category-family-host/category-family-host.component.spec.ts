import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { CategoryFamilyHostComponent } from './category-family-host.component';


describe('Category Family Host Component', () => {
  let fixture: ComponentFixture<CategoryFamilyHostComponent>;
  let component: CategoryFamilyHostComponent;
  const categoriesServiceMock: CategoriesService = mock(CategoriesService);
  class ActivtedRouteStub {
    params = Observable.of('url');
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        CategoryFamilyHostComponent
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ActivatedRoute, useClass: ActivtedRouteStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFamilyHostComponent);
    component = fixture.componentInstance;
  });

  xit('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  xit(`should set isFamilyPage to true when subCategory is a Leaf node`, () => {
    when(categoriesServiceMock.current).thenReturn({ hasOnlineSubCategories: false } as Category);
    fixture.detectChanges();
  });


  xit(`should set isFamilyPage to false when subCategory is a Non-Leaf node`, inject([CategoriesService], (categoriesService: CategoriesService) => {
    when(categoriesServiceMock.current).thenReturn({ hasOnlineSubCategories: true } as Category);
    fixture.detectChanges();
  }));
});

