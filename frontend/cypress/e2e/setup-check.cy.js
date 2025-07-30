describe('Cypress Setup Check', () => {
  it('should open an external site', () => {
    cy.visit('https://example.cypress.io');
    cy.contains('Kitchen Sink');
  });
});
