import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { deepEqual, spy, verify } from 'ts-mockito';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { contentReducers } from '../../store/content.system';
import { LoadContentInclude, LoadContentIncludeSuccess } from '../../store/includes';

import { ContentIncludeContainerComponent } from './content-include.container';

describe('Content Include Container', () => {
  let component: ContentIncludeContainerComponent;
  let fixture: ComponentFixture<ContentIncludeContainerComponent>;
  let element: HTMLElement;
  let include: ContentInclude;
  let store$: Store<{}>;

  beforeEach(async(() => {
    include = {
      id: 'test.include',
      displayName: 'test.include',
      definitionQualifiedName: 'test.include-Include',
      pagelets: [],
    } as ContentInclude;

    TestBed.configureTestingModule({
      declarations: [
        ContentIncludeContainerComponent,
        MockComponent({ selector: 'ish-content-pagelet', template: 'Content Pagelet', inputs: ['pagelet'] }),
      ],
      imports: ngrxTesting({
        content: combineReducers(contentReducers),
      }),
    }).compileComponents();

    store$ = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentIncludeContainerComponent);
    component = fixture.componentInstance;
    component.includeId = include.displayName;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch a content loading action on ngOnInit', () => {
    const storeSpy$ = spy(store$);

    fixture.detectChanges();

    verify(storeSpy$.dispatch(deepEqual(new LoadContentInclude('test.include')))).once();
  });

  describe('with content', () => {
    beforeEach(() => {
      fixture.detectChanges();
      store$.dispatch(new LoadContentIncludeSuccess(include));
    });

    it('should have the matching include available for rendering', () => {
      expect(component.contentInclude$).toBeObservable(cold('a', { a: include }));
    });
  });
});
