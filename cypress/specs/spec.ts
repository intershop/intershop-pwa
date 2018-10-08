it('loads', () => {
  cy.visit('/');
  cy.get('a[data-testing-id="Computers-link"]')
    .last()
    .click();
  cy.get('[data-testing-id="category-Computers.897"] a').click({ force: true });
  cy.get('[data-testing-id="category-Computers.897.897_Microsoft"] a').click({ force: true });

  cy.get('div.loading', { timeout: 10000 }).should('not.exist');
  cy.get('[data-testing-sku="201807199"]').should('be.visible');
  cy.get('[data-testing-sku="201807199"] ish-product-price').should('have.text', ' $84.79 ');
});
