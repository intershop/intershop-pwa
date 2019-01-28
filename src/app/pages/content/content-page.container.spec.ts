import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { deepEqual, spy, verify } from 'ts-mockito';

import { ContentPage } from 'ish-core/models/content-page/content-page.model';
import { contentReducers } from 'ish-core/store/content/content-store.module';
import { LoadContentPage, LoadContentPageSuccess } from 'ish-core/store/content/pages';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ContentPageContainerComponent } from './content-page.container';

describe('Content Page Container', () => {
  let fixture: ComponentFixture<ContentPageContainerComponent>;
  let component: ContentPageContainerComponent;
  let element: HTMLElement;
  let page: ContentPage;
  let params$: Subject<Params>;
  let store$: Store<{}>;

  beforeEach(async(() => {
    page = {
      id: 'test.page',
      definitionQualifiedName: 'test.page-Page',
      displayName: 'test page',
      link: undefined,
    };
    params$ = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [
        ContentPageContainerComponent,
        MockComponent({ selector: 'ish-content-page', template: 'Content Page Component', inputs: ['contentPage'] }),
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          content: combineReducers(contentReducers),
        }),
      ],
      providers: [ContentPageContainerComponent, { provide: ActivatedRoute, useValue: { params: params$ } }],
    }).compileComponents();

    store$ = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    params$.next({ contentPageId: 'test.page' });

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch a content loading action on ngOnInit', () => {
    const storeSpy$ = spy(store$);
    fixture.detectChanges();
    params$.next({ contentPageId: 'test.page' });

    verify(storeSpy$.dispatch(deepEqual(new LoadContentPage({ id: 'test.page' })))).once();
  });

  describe('with content', () => {
    beforeEach(() => {
      fixture.detectChanges();
      store$.dispatch(new LoadContentPageSuccess({ page, pagelets: [] }));
    });
  });
});
