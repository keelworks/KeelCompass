describe('Question Tests', () => {
  beforeEach(() => {
    // Step 1: Visit login page
    cy.visit('http://localhost:5173/');

    // Step 2: Fill in login form and submit
    cy.get('input[name="email"]').type('Testingsetup2@gmail.com');
    cy.get('input[name="password"]').type('T1234567');
    cy.contains('button', 'Login').click();

    // Step 3: Wait for dashboard to load after login
    cy.url().should('include', '/dashboard');

    // Step 4: Click "Ask Question" (force click due to potential overlap)
    cy.contains('button', 'Ask Question').click({ force: true });

    // Step 5: Confirm we are on the question creation page
    cy.url().should('include', '/questions/new');
    cy.contains('Post your question').should('exist');
  });

  it('should allow entering a question title', () => {
    cy.get('input[name="questionTitle"]')
      .should('exist')
      .should('be.visible')
      .type('Test Question Title')
      .should('have.value', 'Test Question Title');
  });

  it('should allow entering a question description', () => {
    cy.get('textarea[name="description"]')
      .should('exist')
      .should('be.visible')
      .type('This is a test question description')
      .should('have.value', 'This is a test question description');
  });

  it('should display validation messages for empty fields', () => {
    cy.get('button[type="submit"]').click();

    // Check for validation messages
    cy.contains('Title is required').should('exist');
    cy.contains('Description is required').should('exist');
    cy.get('form').screenshot('after-submit')


  });
});
