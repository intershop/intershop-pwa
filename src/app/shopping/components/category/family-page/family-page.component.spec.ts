import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Category } from '../../../../models/category/category.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { FamilyPageComponent } from './family-page.component';

describe('Family Page Component', () => {
  let component: FamilyPageComponent;
  let fixture: ComponentFixture<FamilyPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyPageComponent,
        MockComponent({
          selector: 'ish-category-navigation',
          template: 'Category Navigation Component',
          inputs: ['category', 'categoryPath', 'categoryNavigationLevel'],
        }),
        MockComponent({
          selector: 'ish-product-list-toolbar',
          template: 'Products List Toolbar Component',
          inputs: ['itemCount', 'viewType', 'sortBy', 'sortKeys'],
        }),
        MockComponent({
          selector: 'ish-product-list',
          template: 'Products List Component',
          inputs: ['products', 'category', 'viewType'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.category = {} as Category;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
