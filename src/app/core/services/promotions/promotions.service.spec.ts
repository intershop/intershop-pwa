import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { PromotionsService } from './promotions.service';

describe('Promotions Service', () => {
  let apiServiceMock: ApiService;
  let promotionsService: PromotionsService;

  const promotionMockData = {
    id: 'PROMO_UUID',
    name: 'MyPromotion',
    couponCodeRequired: false,
    currency: 'EUR',
    promotionType: 'MyPromotionType',
    description: 'MyPromotionDescription',
    legalContentMessage: 'MyPromotionContentMessage',
    longTitle: 'MyPromotionLongTitle',
    ruleDescription: 'MyPromotionRuleDescription',
    title: 'MyPromotionTitle',
    useExternalUrl: false,
    disableMessages: false,
  } as Promotion;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    promotionsService = TestBed.inject(PromotionsService);
  });

  it('should be created', () => {
    expect(promotionsService).toBeTruthy();
  });

  it("should get Promotion data when 'getPromotion' is called", done => {
    when(apiServiceMock.get(`promotions/PROMO_UUID`)).thenReturn(of(promotionMockData));
    promotionsService.getPromotion('PROMO_UUID').subscribe(data => {
      expect(data.id).toEqual('PROMO_UUID');
      verify(apiServiceMock.get(`promotions/PROMO_UUID`)).once();
      done();
    });
  });
});
