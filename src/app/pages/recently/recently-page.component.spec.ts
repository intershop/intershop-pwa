import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';

import { RecentlyPageComponent } from './recently-page.component';
import { RecentlyViewedAllComponent } from './recently-viewed-all/recently-viewed-all.component';

describe('Recently Page Component', () => {
  let component: RecentlyPageComponent;
  let fixture: ComponentFixture<RecentlyPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(RecentlyViewedAllComponent),
        RecentlyPageComponent,
      ],
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: { shopping: combineReducers(shoppingReducers) } })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
