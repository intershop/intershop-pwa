import { ProofOfConceptPage } from './app.po';

describe('proof-of-concept App', () => {
  let page: ProofOfConceptPage;

  beforeEach(() => {
    page = new ProofOfConceptPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
