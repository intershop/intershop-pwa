import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';
import { FilterNavigationContainerComponent } from './filter-navigation.container';

describe('FilterNavigationContainerComponent', () => {
  let component: FilterNavigationContainerComponent;
  let fixture: ComponentFixture<FilterNavigationContainerComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            shopping: combineReducers(shoppingReducers),
          }),
        ],
        declarations: [
          MockComponent({ selector: 'ish-filter-dropdown', template: 'Dropdown Filter', inputs: ['filterElement'] }),
          FilterNavigationContainerComponent,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
