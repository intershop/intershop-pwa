import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Category } from '../../../../models/category/category.model';
import { CategoryNavigationComponent } from './category-navigation.component';

describe('Category Navigation Component', () => {
  let component: CategoryNavigationComponent;
  let fixture: ComponentFixture<CategoryNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryNavigationComponent],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(mock(CategoriesService)) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CategoryNavigationComponent);
      component = fixture.componentInstance;
      component.categoryPath = [new Category('1', 'a', '1')];
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
