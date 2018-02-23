import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../dev-utils/mock.component';
import { FamilyPageComponent } from './family-page.component';

xdescribe('Family Page Component', () => {
  let component: FamilyPageComponent;
  let fixture: ComponentFixture<FamilyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyPageComponent,
        MockComponent({ selector: 'ish-category-navigation', template: 'Category Navigation Component', inputs: ['category', 'categoryPath', 'categoryNavigationLevel'] }),
        MockComponent({ selector: 'ish-product-list-toolbar', template: 'Products List Toolbar Component', inputs: ['itemCount', 'viewType', 'sortBy'] }),
        MockComponent({ selector: 'ish-product-list', template: 'Products List Component', inputs: ['products', 'viewType'] })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
