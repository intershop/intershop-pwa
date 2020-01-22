import { HYBRID_MAPPING_TABLE, ICM_WEB_URL } from './default-url-mapping-table';

describe('Default Url Mapping Table', () => {
  describe('ICM_WEB_URL', () => {
    it('should only contain placeholders for supported properties', () => {
      const supported = ['channel', 'lang', 'application', 'currency'];
      const allReplaced = supported.reduce((acc, val) => acc.replace(`\$<${val}>`, 'something'), ICM_WEB_URL);
      expect(allReplaced).not.toMatch(/\$<.*?>/);
    });
  });

  describe('HYBRID_MAPPING_TABLE', () => {
    it.each(HYBRID_MAPPING_TABLE.map(e => e.icm))(`{icm: '%p'} should be a valid regex`, entry => {
      expect(() => new RegExp(entry)).not.toThrow();
    });

    it.each(HYBRID_MAPPING_TABLE.map(e => e.pwa))(`{pwa: '%p'} should be a valid regex`, entry => {
      expect(() => new RegExp(entry)).not.toThrow();
    });

    it.each(HYBRID_MAPPING_TABLE.map(e => e.pwa))(
      `{pwa: '%p'} should not use named capture groups due to browser compatibility`,
      entry => {
        expect(entry).not.toMatch(/\(\?<.*?>.*?\)/);
      }
    );

    it.each(HYBRID_MAPPING_TABLE.map(e => e.icmBuild))(
      `{icmBuild: '%p'} should not use named capture group replacements due to browser compatibility`,
      entry => {
        expect(entry).not.toMatch(/\$<.*?>/);
      }
    );
  });
});
