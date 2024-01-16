describe("URL Shortener", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3001/api/v1/urls", {
      fixture: "urls.json",
    }).as("getUrls");
  });

  it("should display the main page with heading, form, and all urls", () => {
    cy.visit("http://localhost:3000/");
    cy.wait("@getUrls");

    cy.get("h1").should("contain", "URL Shortener");
    cy.get("form input").should("have.length", 2);
    cy.get("form button").should("exist");

    cy.get(".url").should("have.length", 2); 
    cy.get(".url").first().within(() => {
      cy.get("h3").should("contain", "Awesome photo");
      cy.get("a").should("contain", "http://localhost:3001/useshorturl/1");
      cy.get("p").should("contain", "https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80");
    });
    cy.get(".url").last().within(() => {
      cy.get("h3").should("contain", "Bird");
      cy.get("a").should("contain", "http://localhost:3001/useshorturl/2");
      cy.get("p").should("contain", "https://media.audubon.org/2022-09/stay_abreast_bird.png");
    });
  });

});