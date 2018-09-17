import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { createImagePageletView } from '../../../models/content-view/content-image-view';
import { createSimplePageletView } from '../../../models/content-view/content-views';

import { CMSImageComponent } from './cms-image.component';

describe('Cms Image Component', () => {
  let component: CMSImageComponent;
  let fixture: ComponentFixture<CMSImageComponent>;
  let element: HTMLElement;
  const BASE_URL = 'http://www.example.org';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSImageComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: STATIC_URL, useValue: BASE_URL }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: {
        Image: 'foo:bar.png',
        AlternateText: 'foo',
        CSSClass: 'foo',
        Link: 'link://foo',
        LinkTitle: 'bar',
      },
      slots: [],
    };
    component.pagelet = createImagePageletView(createSimplePageletView(pagelet));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
