import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { MockComponent } from '../../../dev-utils/mock.component';
import { reducers } from '../../store/shopping.system';
import { CategoryPageContainerComponent } from './category-page.container';

describe('Category Page Container', () => {
  let component: CategoryPageContainerComponent;
  let fixture: ComponentFixture<CategoryPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers)
        })
      ],
      declarations: [
        CategoryPageContainerComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['category', 'categoryPath'] }),
        MockComponent({ selector: 'ish-category-page', template: 'Category Page Component', inputs: ['category', 'categoryPath'] }),
        MockComponent({ selector: 'ish-family-page', template: 'Family Page Component', inputs: ['category', 'categoryPath', 'products', 'totalItems', 'viewType', 'sortBy', 'sortKeys'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
