import {EncryptDecryptService} from './encrypt-decrypt.service';

describe('EncryptDecrypt service test.', () => {
  let encrDecr: EncryptDecryptService;

  beforeEach(() => {
    encrDecr = new EncryptDecryptService();
  });

  it('should encrypt the given value', () => {
    const value = encrDecr.encrypt('test data', 'key');
    expect(value).not.toBeNull();
  });

  it('should decrypt the given value', () => {
    const value = encrDecr.decrypt('U2FsdGVkX189J/BXkYkE41IVrgKkb5zdArzsChEGXJQ=', 'key');
    expect(value).not.toBeNull();
  });
});
