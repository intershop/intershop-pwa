import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSVideoComponent } from './cms-video.component';

describe('Cms Video Component', () => {
  let component: CMSVideoComponent;
  let fixture: ComponentFixture<CMSVideoComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;
  let componentSpy: CMSVideoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMSVideoComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSVideoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {
        VideoSizePreset: 'auto',
        Video: 'https://www.youtube.com/watch?v=7DbslbKsQSk',
        Autoplay: 'false',
        CSSClass: 'container',
        Mute: 'false',
      },
    };
    pageletView = createContentPageletView(pagelet);
    component.pagelet = pageletView;
    componentSpy = spy(component);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should only call YouTube processor for YouTube URL', () => {
    fixture.detectChanges();
    verify(componentSpy.tryProcessYoutubeVideo()).once();
    verify(componentSpy.tryProcessVimeoVideo()).never();
    verify(componentSpy.tryProcessDefaultVideo()).never();
  });

  it('should only call Vimeo processor for Vimeo URL', () => {
    pagelet.configurationParameters.Video = 'https://vimeo.com/8531948';
    component.pagelet = createContentPageletView(pagelet);

    fixture.detectChanges();
    verify(componentSpy.tryProcessYoutubeVideo()).once();
    verify(componentSpy.tryProcessVimeoVideo()).once();
    verify(componentSpy.tryProcessDefaultVideo()).never();
  });

  it('should only call default processor for misc video URL', () => {
    pagelet.configurationParameters.Video = 'https://example.com/myvideo.mp4';
    component.pagelet = createContentPageletView(pagelet);

    fixture.detectChanges();
    verify(componentSpy.tryProcessYoutubeVideo()).once();
    verify(componentSpy.tryProcessVimeoVideo()).once();
    verify(componentSpy.tryProcessDefaultVideo()).once();
  });
});
