import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

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
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
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
