import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { GeoAttributes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { routerTestNavigationAction } from 'ish-core/utils/dev/routing';
import { DomService } from 'ish-core/utils/dom/dom.service';

import { GeoHelper } from '../../models/geo/geo.helper';
import { SchemaFAQPage, SchemaHowTo } from '../../models/geo/geo.model';

import { GeoEffects } from './geo.effects';

describe('Geo Effects', () => {
  let actions$: Observable<Action>;
  let actionsSubject$: Subject<Action>;
  let productSubject$: Subject<object>;
  let effects: GeoEffects;
  let storeMock: Pick<Store, 'pipe'>;
  let domServiceMock: Pick<DomService, 'upsertJsonLdScript'>;

  beforeEach(() => {
    actionsSubject$ = new Subject<Action>();
    actions$ = actionsSubject$.asObservable();
    productSubject$ = new Subject<object>();

    storeMock = {
      pipe: jest.fn(() => productSubject$.asObservable()),
    };

    domServiceMock = {
      upsertJsonLdScript: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: DomService, useValue: domServiceMock },
        { provide: Store, useValue: storeMock },
        GeoEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(GeoEffects);
    jest.spyOn(ProductHelper, 'getAttributesOfGroup').mockReturnValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('geoFaqJsonLd$', () => {
    it('should remove existing FAQ json-ld script on route change', done => {
      const existingScript = {} as HTMLScriptElement;
      const insertedScript = {} as HTMLScriptElement;
      const faq: SchemaFAQPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Question',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Answer',
            },
          },
        ],
      };

      jest
        .spyOn(AttributeHelper, 'getAttributeByAttributeName')
        .mockReturnValue({ name: GeoAttributes.GeoFaq, value: 'faq' });
      jest.spyOn(GeoHelper, 'parseGeoAttribute').mockReturnValueOnce(faq).mockReturnValueOnce(undefined);
      (domServiceMock.upsertJsonLdScript as jest.Mock)
        .mockReturnValueOnce(existingScript)
        .mockReturnValueOnce(insertedScript)
        .mockReturnValueOnce(insertedScript)
        .mockReturnValueOnce(undefined);

      effects.geoFaqJsonLd$.pipe(take(2)).subscribe({
        next: geo => {
          if (geo) {
            actionsSubject$.next(routerTestNavigationAction({}));
            productSubject$.next({});
            return;
          }

          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(1, undefined, undefined);
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(2, existingScript, faq);
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(3, insertedScript, undefined);
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(4, insertedScript, undefined);
          done();
        },
        error: done.fail,
      });

      productSubject$.next({});
    });

    it('should not insert FAQ json-ld script for invalid payload', done => {
      jest
        .spyOn(AttributeHelper, 'getAttributeByAttributeName')
        .mockReturnValue({ name: GeoAttributes.GeoFaq, value: 'invalid' });
      jest.spyOn(GeoHelper, 'parseGeoAttribute').mockReturnValue(undefined);
      (domServiceMock.upsertJsonLdScript as jest.Mock).mockReturnValue(undefined);

      effects.geoFaqJsonLd$.pipe(take(1)).subscribe({
        next: () => {
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(1, undefined, undefined);
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(2, undefined, undefined);
          done();
        },
        error: done.fail,
      });

      productSubject$.next({});
    });
  });

  describe('geoHowToJsonLd$', () => {
    it('should not insert HowTo json-ld script for empty steps', done => {
      const howTo: SchemaHowTo = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'HowTo',
        step: [],
      };

      jest
        .spyOn(AttributeHelper, 'getAttributeByAttributeName')
        .mockReturnValue({ name: GeoAttributes.GeoHowTo, value: 'howTo' });
      jest.spyOn(GeoHelper, 'parseGeoAttribute').mockReturnValue(howTo);
      (domServiceMock.upsertJsonLdScript as jest.Mock).mockReturnValue(undefined);

      effects.geoHowToJsonLd$.pipe(take(1)).subscribe({
        next: () => {
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(1, undefined, undefined);
          expect(domServiceMock.upsertJsonLdScript).toHaveBeenNthCalledWith(2, undefined, undefined);
          done();
        },
        error: done.fail,
      });

      productSubject$.next({});
    });
  });
});
