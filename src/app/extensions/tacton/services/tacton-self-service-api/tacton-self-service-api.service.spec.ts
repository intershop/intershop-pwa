import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { pick } from 'lodash-es';

import { TactonSelfServiceApiConfiguration } from '../../models/tacton-self-service-api-configuration/tacton-self-service-api-configuration.model';
import { getNewExternalId, getSelfServiceApiConfiguration } from '../../store/tacton-config';

import { TactonSelfServiceApiService } from './tacton-self-service-api.service';

describe('Tacton Self Service Api Service', () => {
  let tactonSelfServiceApiService: TactonSelfServiceApiService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: getSelfServiceApiConfiguration,
              value: {
                endPoint: 'http://example.com/self-service',
                apiKey: 'ASDF',
              } as TactonSelfServiceApiConfiguration,
            },
            {
              selector: getNewExternalId,
              value: 'NewID',
            },
          ],
        }),
      ],
    });
    tactonSelfServiceApiService = TestBed.inject(TactonSelfServiceApiService);

    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(tactonSelfServiceApiService).toBeTruthy();
  });

  describe('startConfiguration', () => {
    it('should always call underlying service config/start endpoint with product id', done => {
      tactonSelfServiceApiService.startConfiguration('123456').subscribe(
        data => {
          expect(data).toMatchInlineSnapshot(`
                      Object {
                        "configId": "Hello!",
                        "externalId": "NewID",
                      }
                  `);
        },
        fail,
        done
      );

      const req = controller.expectOne(() => true);

      expect(pick(req.request, 'urlWithParams', 'body', 'method')).toMatchInlineSnapshot(`
        Object {
          "body": "_key=ASDF&_externalId=NewID",
          "method": "POST",
          "urlWithParams": "http://example.com/self-service/self-service-api/config/start/123456",
        }
      `);

      req.flush({ configId: 'Hello!' });
    });

    it('should return errors when something is wrong', done => {
      tactonSelfServiceApiService.startConfiguration('123456').subscribe(
        fail,
        err => {
          expect(err?.message).toMatchInlineSnapshot(
            `"Http failure response for http://example.com/self-service/self-service-api/config/start/123456: 400 ERROR"`
          );
          done();
        },
        fail
      );

      const req = controller.expectOne(() => true);

      req.flush('NOPE!', { status: 400, statusText: 'ERROR' });
    });
  });
});
