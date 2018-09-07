import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

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
    component.pagelet = {
      configurationParameters: {
        Image: { value: 'foo:bar.png' },
        AlternateText: { value: 'foo' },
        CSSClass: { value: 'foo' },
        Link: { value: 'link://foo' },
        LinkTitle: { value: 'bar' },
      } as any,
    } as ContentPagelet;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
