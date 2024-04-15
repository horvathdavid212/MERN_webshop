// describe("Felhasználó regisztrál és belép", () => {
//   beforeEach(() => {
//     cy.visit("http://localhost:5173/");
//   });

//   it("Egy felhasználó regisztrál", () => {
//     cy.get("#loginButton").click();

//     cy.url().should("include", "/signin");

//     cy.get("#signupLink").click();

//     cy.url().should("include", "/signup");

//     cy.get("#name").type("Test User");
//     cy.get("#email").type("testuser@example.com");
//     cy.get("#password").type("testpassword");
//     cy.get("#confirm-password").type("testpassword");

//     cy.get("#signupButton").click();
//   });

//   it("Egy felhasználó bejelentkezik", () => {
//     cy.get("#loginButton").click();

//     cy.url().should("include", "/signin");

//     cy.get("#email").type("testuser@example.com");
//     cy.get("#password").type("testpassword");

//     cy.get("#loginButtonLOGIN").click();
//   });
// });

describe("Felhasználói interakciók", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  before(() => {
    cy.visit("http://localhost:5173/");
    cy.get("#loginButton").click();
    cy.url().should("include", "/signin");
    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("testpassword");
    cy.get("#loginButtonLOGIN").click();

    cy.url().should("not.include", "/signin");
  });

  it("Egy felhasználó keres egy termékre", () => {
    cy.get("#searchBox").type("PlayStation{enter}");

    cy.contains("PlayStation").should("be.visible");
    cy.url().should("include", "/search/?searchKeyword=PlayStation");
  });

  it("Egy felhasználó megtekint egy terméket", () => {
    cy.contains("PlayStation").should("be.visible").click();
    cy.url().should("include", "/product/ps5");
  });

  it("Egy felhasználó hozzáad egy terméket a kosarához", () => {
    cy.contains("PlayStation").should("be.visible").click();
    cy.contains("button", "Kosárba").click();
    cy.get("#checkoutNextButton").click();
  });

  it("Egy felhasználó lead egy rendelést", () => {
    //belépés
    cy.visit("http://localhost:5173/");
    cy.get("#loginButton").click();
    cy.url().should("include", "/signin");
    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("testpassword");
    cy.get("#loginButtonLOGIN").click();

    // kosárba helyezés
    cy.contains("PlayStation").should("be.visible").click();
    cy.contains("button", "Kosárba").click();
    cy.get("#checkoutNextButton").click();

    // szllítási cím megadása
    cy.get("#fullName").type("John Doe");
    cy.get("#postalCode").type("12345");
    cy.get("#city").type("Budapest");
    cy.get("#address").type("Main Street 123");
    cy.contains("Tovább").should("be.visible").click();
    cy.url().should("include", "/payment");

    // fizetési mód kiválasztása
    cy.get("#utánvét").find('input[type="radio"]').click();

    cy.contains("button", "Tovább").click();
    cy.url().should("include", "/placeorder");

    // kupon kód megadása
    cy.get("#couponCode").type("a90");

    cy.contains("button", "Alkalmaz").click();

    // rendelés leadása
    cy.contains("button", "Rendelés leadása").click();
  });

  it("Egy felhasználó megtekinti előző rendelésit", () => {
    //belépés
    cy.visit("http://localhost:5173/");
    cy.get("#loginButton").click();
    cy.url().should("include", "/signin");
    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("testpassword");
    cy.get("#loginButtonLOGIN").click();

    // előző rendelések megtekintése
    cy.get("#userButton").click();

    cy.get("#orderHistoryButton").click();
  });

  it("Egy felhasználó hozzáad egy terméket a kedvenceihez és megtekinti", () => {
    //belépés
    cy.visit("http://localhost:5173/");
    cy.get("#loginButton").click();
    cy.url().should("include", "/signin");
    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("testpassword");
    cy.get("#loginButtonLOGIN").click();

    cy.get("#favoriteButton").click();

    cy.get("#favoritesButton").click();
  });

  // it("Egy felhasználó módosítja a profilját", () => {});

  // it("Egy felhasználó kijelentkezik", () => {});

  // it("Egy felhasználó elfelejti a jelszavát", () => {});
});
