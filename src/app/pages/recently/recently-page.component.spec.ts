import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
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
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) }],
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
