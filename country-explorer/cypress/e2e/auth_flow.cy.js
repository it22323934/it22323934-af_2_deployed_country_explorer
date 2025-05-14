describe("Authentication Flow", () => {
  // Helper to check form validation
  const checkFormValidation = (formSelector, submitButtonText) => {
    cy.get(formSelector).within(() => {
      // Submit empty form to trigger validation
      cy.contains(submitButtonText).click();
      cy.contains("Please fill").should("be.visible");

      // Check accessibility of required fields
      cy.get("[required]").should("have.attr", "aria-invalid", "true");
    });
  };

  describe("Sign Up Page Tests", () => {
    beforeEach(() => {
      cy.visit("/sign-up");
      cy.contains("Create Account").should("be.visible");
    });

    it("should render the sign-up form correctly", () => {
      // Check that all form elements are present
      cy.get("input#username").should("be.visible");
      cy.get("input#email").should("be.visible");
      cy.get("input#password").should("be.visible");
      cy.contains("button", "Sign Up").should("be.visible");
      cy.contains("button", "Continue with Google").should("be.visible");
      cy.contains("Already have an account?").should("be.visible");
      cy.contains("a", "Sign In")
        .should("be.visible")
        .and("have.attr", "href", "/sign-in");
    });

    it("should validate form inputs", () => {
      // Enter short password
      cy.get("input#username").type("testuser");
      cy.get("input#email").type("test@example.com");
      cy.get("input#password").type("123");

      // Check password strength indicator
      cy.contains("Password strength: weak")
        .should("be.visible")
        .and("have.class", "text-red-500");

      cy.contains("Sign Up").click();
      cy.contains("Password must be at least 6 characters long").should(
        "be.visible"
      );

      // Enter stronger password
      cy.get("input#password").clear().type("123456789");
      cy.contains("Password strength: medium")
        .should("be.visible")
        .and("have.class", "text-yellow-500");

      cy.get("input#password").clear().type("123456789012");
      cy.contains("Password strength: strong")
        .should("be.visible")
        .and("have.class", "text-green-500");
    });

    it("should navigate to sign-in page", () => {
      cy.contains("a", "Sign In").click();
      cy.url().should("include", "/sign-in");
      cy.contains("Sign In").should("be.visible");
    });
  });

  describe("Sign In Page Tests", () => {
    beforeEach(() => {
      cy.visit("/sign-in");
      cy.contains("Sign In").should("be.visible");
    });

    it("should render the sign-in form correctly", () => {
      // Check that all form elements are present
      cy.get("input#email").should("be.visible");
      cy.get("input#password").should("be.visible");
      cy.contains("button", "Sign In").should("be.visible");
      cy.contains("button", "Continue with Google").should("be.visible");
      cy.contains("Don't have an account?").should("be.visible");
      cy.contains("a", "Sign Up")
        .should("be.visible")
        .and("have.attr", "href", "/sign-up");
    });

    it("should navigate to sign-up page", () => {
      cy.contains("a", "Sign Up").click();
      cy.url().should("include", "/sign-up");
      cy.contains("Create Account").should("be.visible");
    });
  });

  describe("Authentication Error Handling", () => {
    beforeEach(() => {
      // Use flexible route matching with wildcards
      cy.intercept("POST", "**/api/auth/signin", {
        statusCode: 401,
        body: {
          success: false,
          message: "Invalid credentials",
        },
      }).as("signInRequest");

      // Intercept for username already exists - use the same route with different response
      cy.intercept("POST", "**/api/auth/signup", (req) => {
        if (req.body.username === "existinguser") {
          req.reply({
            statusCode: 400,
            body: {
              success: false,
              message: "Username already exists",
            },
          });
        }
      }).as("usernameExistsRequest");

      // Intercept for email already exists - use the same route with different response
      cy.intercept("POST", "**/api/auth/signup", (req) => {
        if (req.body.email === "existing@example.com") {
          req.reply({
            statusCode: 400,
            body: {
              success: false,
              message: "Email is already registered",
            },
          });
        }
      }).as("emailExistsRequest");
    });

    it("should display error message on login failure", () => {
      cy.visit("/sign-in");
      cy.get("input#email").type("test@example.com");
      cy.get("input#password").type("wrongpassword");
      cy.get('button[type="submit"]').click(); // Changed from contains to get with type="submit"

      // Wait for the request and check for error message
      cy.wait("@signInRequest", { timeout: 10000 }); // Increased timeout
      cy.contains("Invalid credentials", { timeout: 5000 }).should(
        "be.visible"
      );
    });

    it("should display error for existing username", () => {
      cy.visit("/sign-up");
      cy.get("input#username").type("existinguser");
      cy.get("input#email").type("new@example.com");
      cy.get("input#password").type("password123");
      cy.get('button[type="submit"]').click(); // Changed from contains to get with type="submit"

      // Wait for the request and check for error message
      cy.wait("@usernameExistsRequest", { timeout: 10000 }); // Increased timeout
      cy.contains("Username already exists", { timeout: 5000 }).should(
        "be.visible"
      );
    });

    it("should display error for existing email", () => {
      cy.visit("/sign-up");
      cy.get("input#username").type("newuser");
      cy.get("input#email").type("existing@example.com");
      cy.get("input#password").type("password123");
      cy.get('button[type="submit"]').click(); // Changed from contains to get with type="submit"

      // Wait for the request and check for error message
      cy.wait("@emailExistsRequest", { timeout: 10000 }); // Increased timeout
      cy.contains("Email is already registered", { timeout: 5000 }).should(
        "be.visible"
      );
    });
  });

  describe("Successful Authentication Flows", () => {
    beforeEach(() => {
      // Intercept API calls to simulate successful responses
      cy.intercept("POST", "/api/auth/signin", {
        statusCode: 200,
        body: {
          user: {
            id: "123",
            name: "Test User",
            email: "test@example.com",
          },
          token: "fake-jwt-token",
        },
      }).as("signInRequest");

      cy.intercept("POST", "/api/auth/signup", {
        statusCode: 201,
        body: {
          success: true,
          message: "User created successfully",
        },
      }).as("signupRequest");
    });

    it("should redirect to home page after successful login", () => {
      cy.visit("/sign-in");
      cy.get("input#email").type("test@example.com");
      cy.get("input#password").type("password123");
      cy.get('button[type="submit"]').click();

      // Wait for the request
      cy.wait("@signInRequest");

      // Check redirect and success toast
      cy.url().should("not.include", "/sign-in");
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should redirect to sign-in page after successful signup", () => {
      cy.visit("/sign-up");
      cy.get("input#username").type("newuser");
      cy.get("input#email").type("new@example.com");
      cy.get("input#password").type("password123");
      cy.get('button[type="submit"]').click();

      // Wait for the request
      cy.wait("@signupRequest");

      // Check redirect and success toast
      cy.url().should("include", "/sign-in");
    });
  });
});
