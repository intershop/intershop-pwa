import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

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
      declarations: [ProductGeoComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  describe('type faqs', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductGeoComponent);
      component = fixture.componentInstance;
      component.type = 'faqs';
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should render FAQs when data is available', () => {
      const faqData = JSON.stringify([
        { name: 'Q1', acceptedAnswer: { text: 'A1' } },
        { name: 'Q2', acceptedAnswer: { text: 'A2' } },
      ]);
      when(context.select('product')).thenReturn(
        of({ sku: '123', attributeGroups: { GEO: { attributes: [{ name: 'GEO_FAQ', value: faqData }] } } })
      );

      fixture.detectChanges();

      expect(element.querySelectorAll('dt')).toHaveLength(2);
      expect(element.querySelector('dt').textContent).toContain('Q1');
    });

    it('should not render FAQs when no data', () => {
      fixture.detectChanges();

      expect(element.querySelectorAll('dt')).toHaveLength(0);
    });
  });

  describe('type howTo', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductGeoComponent);
      component = fixture.componentInstance;
      component.type = 'howTo';
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
        of({ sku: '123', attributeGroups: { GEO: { attributes: [{ name: 'GEO_HOW_TO', value: howToData }] } } })
      );

      fixture.detectChanges();

      expect(element.querySelectorAll('.product-how-to__step')).toHaveLength(2);
      expect(element.querySelector('.product-how-to__step-name').textContent).toContain('Step 1');
    });

    it('should not render HowTo when no data', () => {
      fixture.detectChanges();

      expect(element.querySelectorAll('.product-how-to__step')).toHaveLength(0);
    });
  });
});
