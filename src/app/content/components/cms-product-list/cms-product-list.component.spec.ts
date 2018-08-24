import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
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
    component.pagelet = {
      configurationParameters: {
        Products: { value: ['1@Domain', '2@Domain'] },
        Title: { value: 'PageletTitle' },
        CSSClass: { value: 'css-class' },
        ListItemCSSClass: { value: 'li-css-class' },
      } as any,
    } as ContentPagelet;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
