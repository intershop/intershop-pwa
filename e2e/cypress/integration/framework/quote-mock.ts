export function mockQuotes() {
  const quoteElements = [
    {
      type: 'Link',
      uri: 'quotes/quoteResponded',
      title: 'quoteResponded',
    },
    {
      type: 'Link',
      uri: 'quotes/quoteExpired',
      title: 'quoteExpired',
    },
    {
      type: 'Link',
      uri: 'quotes/quoteRejected',
      title: 'quoteRejected',
    },
  ];

  const quoteRequestElements = [
    {
      type: 'Link',
      uri: 'quoteRequests/quoteSubmitted',
      title: 'quoteSubmitted',
    },
    {
      type: 'Link',
      uri: 'quoteRequests/quoteNew',
      title: 'quoteNew',
    },
  ];

  const items = [
    {
      type: 'QuoteLineItem',
      originQuantity: {
        type: 'Quantity',
        value: 2,
        unit: '',
      },
      originSinglePrice: {
        type: 'Money',
        value: 41.95,
        currency: 'USD',
      },
      originTotalPrice: {
        type: 'Money',
        value: 83.9,
        currency: 'USD',
      },
      quantity: {
        type: 'Quantity',
        value: 2,
        unit: '',
      },
      singlePrice: {
        type: 'Money',
        value: 41.92,
        currency: 'USD',
      },
      totalPrice: {
        type: 'Money',
        value: 83.84,
        currency: 'USD',
      },
      productSKU: '4011592',
    },
  ];

  cy.server();

  cy.route({
    method: 'GET',
    url: '**/quotes',
    status: 200,
    response: { elements: quoteElements, type: 'ResourceCollection', name: 'quotes' },
  });

  cy.route({
    method: 'GET',
    url: '**/quoterequests',
    status: 200,
    response: { elements: quoteRequestElements, type: 'ResourceCollection', name: 'quoteRequests' },
  });

  cy.route({
    method: 'GET',
    url: '**/quotes/quoteResponded',
    status: 200,
    response: {
      type: 'Quote',
      items,
      displayName: 'quoteResponded',
      id: 'quoteResponded',
      number: '01',
      creationDate: 1551264000000,
      validFromDate: 1551264000000,
      validToDate: 1651868800000,
      sellerComment: '',
      originTotal: {
        type: 'Money',
        value: 83.9,
        currency: 'USD',
      },
      total: {
        type: 'Money',
        value: 83.84,
        currency: 'USD',
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '**/quotes/quoteExpired',
    status: 200,
    response: {
      type: 'Quote',
      items,
      displayName: 'quoteExpired',
      id: 'quoteExpired',
      number: '02',
      creationDate: 1551264000000,
      validFromDate: 1551264000000,
      validToDate: 1551264000001,
      sellerComment: '',
      originTotal: {
        type: 'Money',
        value: 83.9,
        currency: 'USD',
      },
      total: {
        type: 'Money',
        value: 83.84,
        currency: 'USD',
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '**/quotes/quoteRejected',
    status: 200,
    response: {
      type: 'Quote',
      items,
      displayName: 'quoteRejected',
      id: 'quoteRejected',
      number: '03',
      creationDate: 1551264000000,
      validFromDate: 1551264000000,
      validToDate: 1651868800000,
      sellerComment: '',
      originTotal: {
        type: 'Money',
        value: 83.9,
        currency: 'USD',
      },
      total: {
        type: 'Money',
        value: 83.84,
        currency: 'USD',
      },
      rejected: true,
    },
  });

  cy.route({
    method: 'GET',
    url: '**/quoteRequests/quoteSubmitted',
    status: 200,
    response: {
      type: 'Quote',
      items,
      displayName: 'quoteSubmitted',
      id: 'quoteSubmitted',
      number: '03',
      creationDate: 1551264000000,
      validFromDate: 1551264000000,
      validToDate: 1651868800000,
      sellerComment: '',
      submitted: true,
      originTotal: {
        type: 'Money',
        value: 83.9,
        currency: 'USD',
      },
      total: {
        type: 'Money',
        value: 83.84,
        currency: 'USD',
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '**/quoteRequests/quoteNew',
    status: 200,
    response: {
      type: 'Quote',
      items,
      displayName: 'quoteNew',
      id: 'quoteNew',
      number: '03',
      creationDate: 1551264000000,
      validFromDate: 1551264000000,
      validToDate: 1651868800000,
      sellerComment: '',
      originTotal: {
        type: 'Money',
        value: 83.9,
        currency: 'USD',
      },
      total: {
        type: 'Money',
        value: 83.84,
        currency: 'USD',
      },
    },
  });
}
