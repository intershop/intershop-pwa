import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSProductListManualComponent } from './cms-product-list-manual.component';

describe('Cms Product List Manual Component', () => {
  let component: CMSProductListManualComponent;
  let fixture: ComponentFixture<CMSProductListManualComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSProductListManualComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {
        Products: ['1@Domain', '2@Domain'],
        Title: 'PageletTitle',
        CSSClass: 'css-class',
        ListItemCSSClass: 'li-css-class',
      },
    };
    component.pagelet = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.productSKUs).toMatchInlineSnapshot(`
      [
        "1",
        "2",
      ]
    `);
  });
});
