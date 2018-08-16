import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';

import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';

import { RecentlyViewedContainerComponent } from './recently-viewed.container';

describe('Recently Viewed Container', () => {
  let component: RecentlyViewedContainerComponent;
  let fixture: ComponentFixture<RecentlyViewedContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecentlyViewedContainerComponent,
        MockComponent({
          selector: 'ish-recently-viewed',
          template: 'Recently Viewed Container',
          inputs: ['products'],
        }),
      ],
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
