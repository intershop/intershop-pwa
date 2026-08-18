import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AttributeGroupTypes, GeoAttributes } from 'ish-core/models/attribute-group/attribute-group.types';

import { ProductGeoComponent } from './product-geo.component';

describe('Product Geo Component', () => {
  let component: ProductGeoComponent;
  let fixture: ComponentFixture<ProductGeoComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({ sku: '123', attributeGroups: {} }));

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [ProductGeoComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }, provideTranslateService()],
    }).compileComponents();
  });

  describe('type faqs', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductGeoComponent);
      component = fixture.componentInstance;
      component.type = 'faq';
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should render FAQs when data is available', () => {
      const faqData = JSON.stringify({
        mainEntity: [
          { name: 'Q1', acceptedAnswer: { text: 'A1' } },
          { name: 'Q2', acceptedAnswer: { text: 'A2' } },
        ],
      });
      when(context.select('product')).thenReturn(
        of({
          sku: '123',
          attributeGroups: {
            [AttributeGroupTypes.ProductGeoAttributes]: {
              attributes: [{ name: GeoAttributes.GeoFaq, value: faqData }],
            },
          },
        })
      );
      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`
        <dl class="product-faq">
          <dt>Q1</dt>
          <dd>A1</dd>
          <dt>Q2</dt>
          <dd>A2</dd>
        </dl>
      `);
    });

    it('should not render FAQs when no data', () => {
      fixture.detectChanges();

      expect(element.querySelectorAll('.product-faq')).toHaveLength(0);
    });
  });

  describe('type howTo', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductGeoComponent);
      component = fixture.componentInstance;
      component.type = 'howto';
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should render HowTo steps when data is available', () => {
      const howToData = JSON.stringify({
        name: 'Test HowTo',
        step: [
          { position: 1, name: 'Step 1', text: 'Do this' },
          { position: 2, name: 'Step 2', text: 'Do that' },
        ],
      });
      when(context.select('product')).thenReturn(
        of({
          sku: '123',
          attributeGroups: {
            [AttributeGroupTypes.ProductGeoAttributes]: {
              attributes: [{ name: GeoAttributes.GeoHowTo, value: howToData }],
            },
          },
        })
      );
      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`
        <h3>Test HowTo</h3>
        <h4>product.how_to.steps</h4>
        <ol class="product-how-to-steps">
          <li>
            <strong>Step 1</strong>
            <p>Do this</p>
          </li>
          <li>
            <strong>Step 2</strong>
            <p>Do that</p>
          </li>
        </ol>
      `);
    });

    it('should not render HowTo when no data', () => {
      fixture.detectChanges();

      expect(element.querySelectorAll('.product-how-to-steps')).toHaveLength(0);
    });
  });
});
