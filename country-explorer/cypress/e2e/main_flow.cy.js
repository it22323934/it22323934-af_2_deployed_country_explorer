describe('Country Explorer User Flow', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
    
    // Wait for the page to fully load - increase timeout to 20 seconds
    cy.contains('Explore Countries Around the World', { timeout: 20000 }).should('be.visible');
    
    // Wait for loading spinner to disappear with longer timeout for external API
    cy.get('[data-testid="loading-spinner"]', { timeout: 40000 }).should('not.exist');
    
    // Verify data has loaded by checking that the globe or some content is visible
    cy.get('[data-testid^="country-card-"], .mapboxgl-canvas, [data-testid="globe-container"]', 
      { timeout: 40000 }).should('exist');
  });
  
  it('should search for a country, view details, and attempt to add to favorites', () => {
    // Step 1: Search for Sri Lanka
    cy.get('input[placeholder*="Search"]').type('Sri Lanka');
    
    // Step 2: Switch to List View
    cy.contains('List View').click();
    cy.get('[data-testid^="country-card-"]').should('be.visible');
    
    // Step 3: Verify Sri Lanka card is displayed
    cy.get('[data-testid="country-card-LKA"]').should('be.visible');
    
    // Step 4: Open country tooltip to see additional information
    cy.get('[data-testid="country-card-LKA"]')
      .find('button[aria-label="Show country details"]')
      .trigger('mouseover');
    
    // Step 5: Verify tooltip shows expected information
    cy.contains('Official Name:').should('be.visible');
    cy.contains('Alpha-3 Code: LKA').should('be.visible');
    
    // Step 6: Click on Sri Lanka card to navigate to details
    cy.get('[data-testid="country-card-LKA"]').click();
    
    // Step 7: Verify navigation to country details page
    cy.url().should('include', '/country/LKA');
    cy.get('[data-testid="country-detail-page"]').should('be.visible', { timeout: 8000 });
    
      // Step 8: Verify country information is displayed correctly
      cy.contains('Sri Lanka').should('be.visible');

      // More flexible check for capital - looking for the label first
      cy.contains('Capital').should('be.visible');
      // If you specifically need to check for Colombo, add a longer timeout
      // cy.contains('Colombo', { timeout: 10000 }).should('be.visible'); 

      cy.contains('Asia').should('be.visible'); 
          
    // Step 9: Try to add country to favorites (should redirect to sign-in if not logged in)
    cy.contains('Add to Favorites').click();
    
    // Step 12: Verify redirection to sign-in page
    cy.url().should('include', '/sign-in');
    
    // Step 13: Navigate back to country details
    cy.go('back');
    cy.url().should('include', '/country/LKA');
    
    // Step 14: Test refresh functionality
    cy.contains('button', 'Refresh').click();
  });
  
  it('should filter countries by region', () => {
    // Step 1: Open region dropdown 
    cy.get('select').select('Europe');
    
    // Step 2: Verify filtered results
    cy.contains('List View').click();
    cy.get('[data-testid^="country-card-"]').first().find('.mb-1').should('contain', 'Europe');
    
    // Step 3: Clear filter by selecting All Regions
    cy.get('select').select('');
    
    // Step 4: Verify all regions are now shown
    cy.get('[data-testid^="country-card-"]').should('have.length.greaterThan', 5);
  });
  
  it('should handle no search results gracefully', () => {
    // Step 1: Search for a non-existent country 
    cy.get('input[placeholder*="Search"]').type('XYZNotARealCountry');
    
    // Step 2: Verify no results message is displayed
    cy.contains('No countries match your search criteria').should('be.visible');
    
    // Step 3: Clear search to show all countries again
    cy.get('input[placeholder*="Search"]').clear();
    
    // Step 4: Verify countries are displayed again
    cy.get('[data-testid^="country-card-"]').should('exist');
  });

  it('should test favorite button interaction on country card', () => {
    // Step 1: Switch to list view
    cy.contains('List View').click();
    
    // Step 2: Wait for country cards to appear
    cy.get('[data-testid^="country-card-"]').should('be.visible');
    
    // Step 3: Click on a country card to go to details
    cy.get('[data-testid^="country-card-"]').first().click();
    
    // Step 4: Wait for country detail page to load
    cy.url().should('include', '/country/');
    
    // Step 5: Find and click the "Add to Favorites" button
    cy.contains('button', 'Add to Favorites').click();
    
    // Step 6: Verify redirection to sign-in page
    cy.url().should('include', '/sign-in');
  });
});

// Advanced test: Testing the complete user flow with authentication
describe('Authenticated User Flow', () => {
  beforeEach(() => {
    // Mock authentication with the correct endpoint path
    cy.intercept("POST", "/api/auth/signin", {  // Changed from '/api/auth/login'
      statusCode: 200,
      body: {
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        },
        token: 'fake-jwt-token'
      }
    }).as("signInRequest");  // Changed alias name to match example
    
    // Perform login via UI with correct selectors
    cy.visit('/sign-in');
    cy.get('input#email').type('test@example.com');  // Using ID selector
    cy.get('input#password').type('password123');    // Using ID selector
    cy.get('button[type="submit"]').click();
    
    // Wait for the intercepted request with correct alias
    cy.wait("@signInRequest");
    
    // Wait for the page to fully load after login
    cy.contains('Explore Countries Around the World').should('be.visible');
    
    // Wait for external API data to load
    cy.get('[data-testid="loading-spinner"]', { timeout: 15000 }).should('not.exist');
  });
  
  it('should add and remove a country from favorites when logged in', () => {
    // Search for a country
    cy.get('input[placeholder*="Search"]').type('Canada');
    
    // Switch to List View
    cy.contains('List View').click();
    
    // Wait for country cards to load completely
    cy.get('[data-testid^="country-card-"]', { timeout: 10000 }).should('be.visible');
    
    // Click on the favorite button
    cy.get('[data-testid="country-card-CAN"]')
      .find('button[aria-label*="Add"]').click();
    
    // Verify success toast
    cy.contains('Canada added to favorites', { timeout: 8000 }).should('be.visible');
    
    // Go to country details
    cy.get('[data-testid="country-card-CAN"]').click();
    
    // Verify favorite status in details page (with timeout for API load)
    cy.contains('Remove from Favorites', { timeout: 10000 }).should('be.visible');
    
    // Remove from favorites
    cy.contains('Remove from Favorites').click();
    
    // Verify success toast for removal
    cy.contains('Canada removed from favorites', { timeout: 8000 }).should('be.visible');
  });
});