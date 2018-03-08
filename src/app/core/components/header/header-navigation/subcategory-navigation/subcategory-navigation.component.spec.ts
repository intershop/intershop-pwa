import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Category } from '../../../../../models/category/category.model';
import { SubCategoryNavigationComponent } from './subcategory-navigation.component';

describe('SubCategory Navigation Component', () => {
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let component: SubCategoryNavigationComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubCategoryNavigationComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.category = new Category('a', 'a', 'a');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
