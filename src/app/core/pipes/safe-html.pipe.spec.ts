import { SafeHtmlPipe } from 'ish-core/pipes/safe-html.pipe';

describe('Safe Html Pipe', () => {
  it('should be created', () => {
    const pipe = new SafeHtmlPipe(undefined);
    expect(pipe).toBeTruthy();
  });
});
