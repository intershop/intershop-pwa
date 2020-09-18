import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSImageComponent } from './cms-image.component';

describe('Cms Image Component', () => {
  let component: CMSImageComponent;
  let fixture: ComponentFixture<CMSImageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMSImageComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {
        Image: 'http://example.com/foo/bar.png',
        AlternateText: 'foo',
        CSSClass: 'foo',
        Link: 'http://example.com',
        LinkTitle: 'bar',
      },
    };
    component.pagelet = createContentPageletView(pagelet);
    component.showImage = true;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <a class="teaser-link" href="http://example.com" title="bar"
        ><div class="defer-load">
          <img
            class="foo"
            ng-reflect-ng-class="foo"
            src="http://example.com/foo/bar.png"
            alt="foo"
          /></div
      ></a>
    `);
  });
});
