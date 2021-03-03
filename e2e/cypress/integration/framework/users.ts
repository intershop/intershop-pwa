import { Registration } from '../pages/account/registration.page';

export function createUserViaREST(user: Partial<Registration>) {
  const customer = {
    firstName: user.firstName,
    lastName: user.lastName,
    customerNo: new Date().getTime().toString(),
    email: user.login,
    phoneHome: user.phoneHome,
    title: user.title,
    address: {
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      addressLine3: user.addressLine3,
      postalCode: user.postalCode,
      city: user.city,
      phoneHome: user.phoneHome,
      countryCode: user.countryCode,
      mainDivision: user.mainDivisionCode,
    },
    credentials: {
      login: user.login,
      password: user.password,
    },
    preferredLanguage: 'en_US',
  };

  cy.request(
    'POST',
    Cypress.env('ICM_BASE_URL') + '/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/customers',
    customer
  ).then(response => {
    expect(response.status).to.equal(201);
  });
}

export function createBasketViaREST(user: Partial<Registration>, lineItems: { [sku: string]: number }) {
  cy.request({
    method: 'POST',
    url: Cypress.env('ICM_BASE_URL') + '/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/baskets',
    body: {},
    auth: {
      user: user.login,
      pass: user.password,
    },
    headers: {
      Accept: 'application/vnd.intershop.basket.v1+json',
    },
  }).then(basketCreationResponse => {
    expect(basketCreationResponse.status).to.equal(201);

    const basketUrl = basketCreationResponse.body.links.self.replace(
      /.*\/INTERSHOP/,
      Cypress.env('ICM_BASE_URL') + '/INTERSHOP'
    );
    expect(basketUrl).not.to.be.empty;
    const authToken = basketCreationResponse.headers['authentication-token'];
    expect(authToken).not.to.be.empty;

    const body = Object.keys(lineItems).map(product => ({ product, quantity: { value: lineItems[product] } }));

    cy.request({
      method: 'GET',
      url: basketUrl + '/items',
      headers: {
        'authentication-token': authToken,
        Accept: 'application/vnd.intershop.basket.v1+json',
      },
    }).then(data => {
      expect(data.status).to.equal(200);
    });

    cy.request({
      method: 'POST',
      url: basketUrl + '/items',
      body,
      headers: {
        'authentication-token': authToken,
        Accept: 'application/vnd.intershop.basket.v1+json',
      },
    }).then(data => {
      expect(data.status).to.equal(201);
    });
  });
}
