import { setDeployUrlInFile } from './deploy-url';

describe('Deploy Url', () => {
  it('should prefix deployUrl for relative javascript chunks', () => {
    const input = '<script src="runtime.js"></script><script src="common.js"></script><script src="1936.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual(
      '<script src="/runtime.js"></script><script src="/common.js"></script><script src="/1936.js"></script>'
    );
  });

  it('should not alter external javascript files', () => {
    const input = '<script src="https://cdn.example.com/runtime.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual(input);
  });
});
