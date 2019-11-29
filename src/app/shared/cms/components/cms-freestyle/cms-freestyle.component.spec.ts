import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CMSFreestyleComponent } from './cms-freestyle.component';

describe('Cms Freestyle Component', () => {
  let component: CMSFreestyleComponent;
  let fixture: ComponentFixture<CMSFreestyleComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting()],
      declarations: [CMSFreestyleComponent, ServerHtmlDirective],
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
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render content if available', () => {
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: { HTML: '<h3>foo</h3>bar' },
    };
    component.pagelet = createContentPageletView(pagelet);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <div>
        <h3>foo</h3>
        bar
      </div>
    `);
  });
});
