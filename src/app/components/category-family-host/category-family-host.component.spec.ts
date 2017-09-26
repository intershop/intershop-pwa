import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoriesService } from '../../services/categories/categories.service';
import { CategoryFamilyHostComponent } from './category-family-host.component';


describe('Category Family Host Component', () => {
  let fixture: ComponentFixture<CategoryFamilyHostComponent>;
  let component: CategoryFamilyHostComponent;
  class ActivtedRouteStub {
    params = Observable.of('url');
  }

  class CategoriesServiceStub {
    current = {
      hasOnlineSubCategories: false
    };
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        CategoryFamilyHostComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivtedRouteStub },
        { provide: CategoriesService, useClass: CategoriesServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFamilyHostComponent);
    component = fixture.componentInstance;
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should set isFamilyPage to true when subCategory is a Leaf node`, () => {
    fixture.detectChanges();
    expect(component.isFamilyPage).toBe(true);
  });

  it(`should set isFamilyPage to false when subCategory is a Non-Leaf node`, inject([CategoriesService], (categoriesService: CategoriesService) => {
    categoriesService.current.hasOnlineSubCategories = true;
    fixture.detectChanges();
    expect(component.isFamilyPage).toBe(false);
  }));
});

