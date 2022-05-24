import { DataRequestData, DataRequestInfo } from './data-request.interface';
import { DataRequestMapper } from './data-request.mapper';

describe('Data Request Mapper', () => {
  describe('fromData', () => {
    it(`should return DataRequestConfirmation information when getting DataRequestData`, () => {
      const payloadData = {
        infos: [{ causes: [{ code: 'already confirmed' }] } as DataRequestInfo],
      } as DataRequestData;

      const dataRequest = DataRequestMapper.fromData(payloadData);

      expect(dataRequest).toMatchInlineSnapshot(`
        Object {
          "infoCode": "already confirmed",
        }
      `);
    });
  });
});
