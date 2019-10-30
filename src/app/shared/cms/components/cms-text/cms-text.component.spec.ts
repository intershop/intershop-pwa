import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CMSTextComponent } from './cms-text.component';

describe('Cms Text Component', () => {
  let component: CMSTextComponent;
  let fixture: ComponentFixture<CMSTextComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting()],
      declarations: [CMSTextComponent, ServerHtmlDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSTextComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render html text pagelet if set', () => {
    const pagelet = {
      id: 'id',
      definitionQualifiedName: 'fq',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: { HTMLText: 'foo' },
    };
    component.pagelet = createContentPageletView(pagelet);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`<span>foo</span>`);
  });
});
