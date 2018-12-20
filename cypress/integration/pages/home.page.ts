import { HeaderModule } from './header.module';

export class HomePage {
  readonly tag = 'ish-home-page-container';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/');
  }

  get content() {
    return cy.get(this.tag);
  }
}
