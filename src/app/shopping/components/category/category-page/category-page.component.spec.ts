import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../dev-utils/mock.component';
import { CategoryPageComponent } from './category-page.component';

xdescribe('Category Page Component', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryPageComponent,
        MockComponent({ selector: 'ish-category-navigation', template: 'Category Navigation Component', inputs: ['category', 'categoryPath', 'categoryNavigationLevel'] }),
        MockComponent({ selector: 'ish-category-list', template: 'Category List Component', inputs: ['categories'] })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
