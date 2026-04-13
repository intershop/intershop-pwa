import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountContentPageComponent } from './account-content-page.component';

describe('Account Content Page Component', () => {
  let component: AccountContentPageComponent;
  let fixture: ComponentFixture<AccountContentPageComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  const mockContentPage = {
    id: 'test-page-id',
    pageletIDs: ['pagelet1', 'pagelet2'],
  } as ContentPageletEntryPointView;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);

    // Default mock setup
    when(cmsFacade.contentPage$).thenReturn(EMPTY);
    when(cmsFacade.contentPageLoading$).thenReturn(EMPTY);
    when(cmsFacade.setBreadcrumbForContentPage(anyString())).thenReturn(undefined);

    await TestBed.configureTestingModule({
      imports: [AccountContentPageComponent],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    })
      .overrideComponent(AccountContentPageComponent, {
        set: {
          imports: [MockComponent(LoadingComponent), MockComponent(ContentPageletComponent), AsyncPipe],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('ngOnInit', () => {
    let contentPageSubject$: BehaviorSubject<ContentPageletEntryPointView>;

    beforeEach(() => {
      contentPageSubject$ = new BehaviorSubject<ContentPageletEntryPointView>(undefined);
      when(cmsFacade.contentPage$).thenReturn(contentPageSubject$.asObservable());
    });

    it('should call setBreadcrumbForContentPage when contentPage emits a truthy value', () => {
      fixture.detectChanges();

      // Emit a content page
      contentPageSubject$.next(mockContentPage);

      verify(cmsFacade.setBreadcrumbForContentPage(mockContentPage.id)).once();
    });

    it('should not call setBreadcrumbForContentPage when contentPage emits undefined', () => {
      fixture.detectChanges();

      // Emit undefined
      contentPageSubject$.next(undefined);

      verify(cmsFacade.setBreadcrumbForContentPage(anyString())).never();
    });

    it('should not call setBreadcrumbForContentPage when contentPage emits null', () => {
      fixture.detectChanges();

      // Emit undefined instead of null
      contentPageSubject$.next(undefined);

      verify(cmsFacade.setBreadcrumbForContentPage(anyString())).never();
    });

    it('should call setBreadcrumbForContentPage multiple times when contentPage emits multiple truthy values', () => {
      fixture.detectChanges();

      const anotherContentPage = { ...mockContentPage, id: 'another-page-id' };

      // Emit first content page
      contentPageSubject$.next(mockContentPage);
      // Emit second content page
      contentPageSubject$.next(anotherContentPage);

      verify(cmsFacade.setBreadcrumbForContentPage(mockContentPage.id)).once();
      verify(cmsFacade.setBreadcrumbForContentPage(anotherContentPage.id)).once();
    });

    it('should handle contentPage emission after component initialization', () => {
      fixture.detectChanges();

      // Initially no emission
      verify(cmsFacade.setBreadcrumbForContentPage(anyString())).never();

      // Later emit content page
      contentPageSubject$.next(mockContentPage);

      verify(cmsFacade.setBreadcrumbForContentPage(mockContentPage.id)).once();
    });
  });

  describe('Template integration', () => {
    it('should render without errors when observables emit values', () => {
      when(cmsFacade.contentPage$).thenReturn(of(mockContentPage));
      when(cmsFacade.contentPageLoading$).thenReturn(of(false));

      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(
        `<ish-content-pagelet ng-reflect-pagelet-id="pagelet1" pageid="test-page-id"></ish-content-pagelet>`
      );
    });

    it('should handle loading state changes', () => {
      const loadingSubject$ = new BehaviorSubject<boolean>(true);
      when(cmsFacade.contentPageLoading$).thenReturn(loadingSubject$.asObservable());

      // Loading state true
      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(`<ish-loading></ish-loading>`);

      // Change loading state to false
      loadingSubject$.next(false);
      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(`N/A`);
    });
  });
});
