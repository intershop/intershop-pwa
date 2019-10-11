import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { HeaderNavigationComponent } from 'ish-shell/header/components/header-navigation/header-navigation.component';

import { HeaderNavigationContainerComponent } from './header-navigation.container';

describe('Header Navigation Container', () => {
  let component: HeaderNavigationContainerComponent;
  let fixture: ComponentFixture<HeaderNavigationContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: { shopping: combineReducers(shoppingReducers) } })],
      declarations: [HeaderNavigationContainerComponent, MockComponent(HeaderNavigationComponent)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderNavigationContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
