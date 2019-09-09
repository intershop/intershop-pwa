import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { contentReducers } from 'ish-core/store/content/content-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BreadcrumbComponent } from '../../shared/common/components/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '../../shared/common/components/loading/loading.component';

import { ContentPageComponent } from './components/content-page/content-page.component';
import { ContentPageContainerComponent } from './content-page.container';

describe('Content Page Container', () => {
  let fixture: ComponentFixture<ContentPageContainerComponent>;
  let component: ContentPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentPageContainerComponent,
        MockComponent(BreadcrumbComponent),
        MockComponent(ContentPageComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [
        RouterTestingModule,
        ngrxTesting({
          content: contentReducers,
        }),
      ],
      providers: [ContentPageContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
