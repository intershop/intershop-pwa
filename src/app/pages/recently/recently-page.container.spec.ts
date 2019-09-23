import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { BreadcrumbComponent } from 'ish-shared/common/components/breadcrumb/breadcrumb.component';

import { RecentlyViewedAllComponent } from './components/recently-viewed-all/recently-viewed-all.component';
import { RecentlyPageContainerComponent } from './recently-page.container';

describe('Recently Page Container', () => {
  let component: RecentlyPageContainerComponent;
  let fixture: ComponentFixture<RecentlyPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(RecentlyViewedAllComponent),
        RecentlyPageContainerComponent,
      ],
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: { shopping: combineReducers(shoppingReducers) } })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
