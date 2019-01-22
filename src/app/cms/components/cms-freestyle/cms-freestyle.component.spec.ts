import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SafeHtmlPipe } from 'ish-core/pipes/safe-html.pipe';
import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';

import { CMSFreestyleComponent } from './cms-freestyle.component';

describe('Cms Freestyle Component', () => {
  let component: CMSFreestyleComponent;
  let fixture: ComponentFixture<CMSFreestyleComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSFreestyleComponent, SafeHtmlPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSFreestyleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });

  it('should render content if available', () => {
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: { HTML: '<h3>foo</h3>bar' },
    };
    component.pagelet = createSimplePageletView(pagelet);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
