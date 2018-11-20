import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createSimplePageletView } from 'ish-core/models/content-view/content-views';
import { MockComponent } from '../../../utils/dev/mock.component';

import { CMSProductListComponent } from './cms-product-list.component';

describe('Cms Product List Component', () => {
  let component: CMSProductListComponent;
  let fixture: ComponentFixture<CMSProductListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSProductListComponent,
        MockComponent({ selector: 'ish-product-tile-container', template: 'Product Tile', inputs: ['productSku'] }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });

  it('should render product list pagelet if available', () => {
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {
        Products: ['1@Domain', '2@Domain'],
        Title: 'PageletTitle',
        CSSClass: 'css-class',
        ListItemCSSClass: 'li-css-class',
      },
    };
    component.pagelet = createSimplePageletView(pagelet);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
