import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IconModule } from 'ish-core/icon.module';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-views';

import { CMSVideoComponent } from './cms-video.component';

describe('Cms Video Component', () => {
  let component: CMSVideoComponent;
  let fixture: ComponentFixture<CMSVideoComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSVideoComponent],
      imports: [IconModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSVideoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
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
    pageletView = createContentPageletView(pagelet.id, { [pagelet.id]: pagelet });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
