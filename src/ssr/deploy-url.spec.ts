import { setDeployUrlInFile } from './deploy-url';

describe('Deploy Url', () => {
  it('should prefix deployUrl for relative javascript chunks', () => {
    const input = '<script src="runtime.js"></script><script src="common.js"></script><script src="1936.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual(
      '<script src="/runtime.js"></script><script src="/common.js"></script><script src="/1936.js"></script>'
    );
  });

  it('should prefix numeric chunk files with a multi-segment deployUrl', () => {
    const input = '<script src="1936.js"></script>';

    expect(setDeployUrlInFile('/za/en/', '/za/en/home', input)).toEqual('<script src="/za/en/1936.js"></script>');
  });

  it('should not alter external javascript files', () => {
    const input = '<script src="https://cdn.example.com/runtime.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual(input);
  });

  it('should not alter protocol-relative external javascript files', () => {
    const input = '<script src="//cdn.example.com/runtime.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual(input);
  });

  it('should not double-prefix javascript files in assets directory', () => {
    const input = '<script src="assets/chunk.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual('<script src="/assets/chunk.js"></script>');
  });

  it('should not double-prefix javascript files in assets directory with leading slash', () => {
    const input = '<script src="/assets/chunk.js"></script>';

    expect(setDeployUrlInFile('/', '/za/en/home', input)).toEqual(input);
  });
});
