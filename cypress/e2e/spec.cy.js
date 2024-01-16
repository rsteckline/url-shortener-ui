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
    cy.get(".url")
      .first()
      .within(() => {
        cy.get("h3").should("contain", "Awesome photo");
        cy.get("a").should("contain", "http://localhost:3001/useshorturl/1");
        cy.get("p").should(
          "contain",
          "https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
        );
      });
    cy.get(".url")
      .last()
      .within(() => {
        cy.get("h3").should("contain", "Bird");
        cy.get("a").should("contain", "http://localhost:3001/useshorturl/2");
        cy.get("p").should(
          "contain",
          "https://media.audubon.org/2022-09/stay_abreast_bird.png"
        );
      });
  });

  it("should have a form that takes input values", () => {
    cy.visit("http://localhost:3000/");
    cy.wait("@getUrls");

    cy.get("form button").should("exist").and("contain", "Shorten Please!");

    cy.get('input[name="title"]').type("Dog");
    cy.get('input[name="urlToShorten"]').type(
      "https://ireallylovedogstheyrethebest.com"
    );
    cy.get('input[name="title"]').should("have.value", "Dog");
    cy.get('input[name="urlToShorten"]').should(
      "have.value",
      "https://ireallylovedogstheyrethebest.com"
    );
  });

  it("should add a new url and verify the button's text and functionality", () => {
    cy.visit("http://localhost:3000/");
    cy.wait("@getUrls");

    cy.get("form button").should("exist").and("contain", "Shorten Please!");

    cy.get('input[name="title"]').type("New Title");
    cy.get('input[name="urlToShorten"]').type(
      "https://reallywildlycrazydumblongurl.com"
    );

    cy.intercept("POST", "http://localhost:3001/api/v1/urls", {
      statusCode: 201,
      body: {
        id: 3,
        title: "New Title",
        short_url: "http://localhost:3001/useshorturl/3",
        long_url: "https://reallywildlycrazydumblongurl.com",
      },
    }).as("postUrl");

    cy.get("form button").click();
    cy.wait("@postUrl");

    cy.get(".url").should("have.length", 3);
    cy.get(".url h3").last().should("contain", "New Title");
    cy.get(".url a")
      .last()
      .should("contain", "http://localhost:3001/useshorturl/3");
    cy.get(".url p")
      .last()
      .should("contain", "https://reallywildlycrazydumblongurl.com");
  });

  it("should display the correct number of URLs and verify the first and last URLs", () => {
    cy.visit("http://localhost:3000/");
    cy.wait("@getUrls");

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
