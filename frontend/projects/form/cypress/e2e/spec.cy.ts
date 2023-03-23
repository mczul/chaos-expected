describe('E2E / Integration', () => {
  describe('Routing', () => {
    ['/', '/does/not/exist'].forEach((initialPath) => {
      it(`must redirect to start page from "${initialPath}"`, () => {
        cy.visit(initialPath);
        cy.url().eq('/start');
      });
    });
  });
});
