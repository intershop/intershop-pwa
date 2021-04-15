import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CMSNavigationComponent } from 'ish-shared/cms/components/cms-navigation/cms-navigation.component';
import { ContentSlotComponent } from 'ish-shared/cms/components/content-slot/content-slot.component';

import { CMSStaticPageComponent } from './cms-static-page.component';

describe('Cms Static Page Component', () => {
  let component: CMSStaticPageComponent;
  let fixture: ComponentFixture<CMSStaticPageComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;
  let cmsFacade: CMSFacade;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CMSStaticPageComponent,
        MockComponent(CMSNavigationComponent),
        MockComponent(ContentSlotComponent),
      ],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSStaticPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {},
    };
    pageletView = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('Navigation', () => {
    beforeEach(() => {
      component.pagelet = createContentPageletView({
        ...pagelet,
        configurationParameters: { ShowNavigation: 'true', NavigationRoot: 'page-1', NavigationDepth: '2' },
      });

      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should display cms navigation if ShowNavigation property is set', () => {
      expect(findAllCustomElements(element)).toContain('ish-cms-navigation');
    });

    it('should set the correct id for the underlying product list', () => {
      fixture.detectChanges();

      const navigation = fixture.debugElement.query(By.css('ish-cms-navigation'))
        .componentInstance as CMSNavigationComponent;

      expect(navigation.contentPageId).toMatchInlineSnapshot(`"page-1"`);
      expect(navigation.root).toMatchInlineSnapshot(`"page-1"`);
      expect(navigation.actualDepth).toMatchInlineSnapshot(`0`);
      expect(navigation.maxDepth).toMatchInlineSnapshot(`2`);
    });

    afterEach(() => {
      component.pagelet = createContentPageletView(pagelet);
    });
  });
});
