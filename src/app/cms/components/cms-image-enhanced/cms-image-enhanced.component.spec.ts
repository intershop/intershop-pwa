import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SafeHtmlPipe } from 'ish-core/pipes/safe-html.pipe';
import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';

import { CMSImageEnhancedComponent } from './cms-image-enhanced.component';

describe('Cms Image Enhanced Component', () => {
  let component: CMSImageEnhancedComponent;
  let fixture: ComponentFixture<CMSImageEnhancedComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSImageEnhancedComponent, SafeHtmlPipe],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSImageEnhancedComponent);
    component = fixture.componentInstance;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {
        Image: 'http://example.net/foo/bar.png',
      },
    };
    component.pagelet = createSimplePageletView(pagelet);
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
