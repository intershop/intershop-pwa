import { ServerConfigData } from './server-config.interface';
import { ServerConfigMapper } from './server-config.mapper';

describe('Server Config Mapper', () => {
  describe('fromData', () => {
    const serverConfigData = {
      data: [
        { applicationType: 'intershop.B2CResponsive', id: 'application', urlIdentifier: '-' },
        { acceleration: true, id: 'basket' },
      ],
    } as ServerConfigData;

    it(`should return the ServerConfig when getting ServerConfigData`, () => {
      const config = ServerConfigMapper.fromData(serverConfigData);

      expect(config).toBeTruthy();
      expect(config.application.id).toBe('application');
      expect(config.basket.id).toBe('basket');

      expect(config.application.applicationType).toBe('intershop.B2CResponsive');
      expect(config.basket.acceleration).toBeTruthy();
    });
  });
});
