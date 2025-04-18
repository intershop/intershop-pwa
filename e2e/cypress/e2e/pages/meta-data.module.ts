import { waitLoadingEnd } from '../framework';

export class MetaDataModule {
  get canonicalLink() {
    return cy.get('head link[rel="canonical"]').then(el => el.attr('href'));
  }

  get title() {
    return cy.get('head title').then(el => el.text());
  }

  private static defaultMeta = {
    'og:image': /.*og-image-default.*/,
    'og:type': 'website',
    'og:locale': 'en_US',
    'og:locale:alternate': ['fr_FR', 'de_DE'],
  };

  meta(key: string) {
    return cy.get(`head meta[${key.startsWith('og:') ? 'property' : 'name'}="${key}"]`).then(el => {
      if (el.length > 1) {
        const contents = [];
        for (let index = 0; index < el.length; index++) {
          const element = el[index];
          contents.push(element.getAttribute('content'));
        }
        return contents;
      }
      return el.attr('content');
    });
  }

  private checkStrategy(val: string | RegExp | string[]) {
    return typeof val === 'string' ? 'equal' : Array.isArray(val) ? 'include.members' : 'match';
  }

  check(expect: { title?: string; url?: RegExp; description?: string; [key: string]: string | RegExp }) {
    waitLoadingEnd(3000);
    const expected = {
      ...MetaDataModule.defaultMeta,
      ...expect,
    };

    if (expected.title) {
      this.title.should('equal', expected.title);
      this.meta('og:title').should('equal', expected.title);
      this.title.then(title => {
        this.meta('og:title').should('equal', title);
      });
    }

    if (expected.url) {
      this.canonicalLink.should('match', expected.url);
      this.meta('og:url').should('match', expected.url);
      this.canonicalLink.then(url => {
        this.meta('og:url').should('equal', url);
      });
    }

    if (expected.description) {
      this.meta('description').should('contain', expected.description);
      this.meta('og:description').should('contain', expected.description);

      (this.meta('description') as Cypress.Chainable<unknown>).then(description => {
        this.meta('og:description').should('equal', description);
      });
    }

    Object.keys(expected)
      .filter(key => key !== 'title' && key !== 'url' && key !== 'description' && !key.startsWith('_'))
      .forEach(key => {
        const val = expected[key];
        this.meta(key).should(this.checkStrategy(val), val);
      });
  }
}
