describe('E2E / Integration', () => {
  describe('Routing', () => {
    ['/', '/does/not/exist'].forEach((initialPath) => {
      it(`must redirect to start page from "${initialPath}"`, () => {
        cy.visit(initialPath);
        cy.location().its('href').should('include', '/start');
        cy.testid('no-known-projects-info').should('exist');
        cy.get('ce-project-list').should('not.exist');
      });
    });
  });
});
