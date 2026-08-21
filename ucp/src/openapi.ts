import { UCP_BASE_PATH, UCP_VERSION } from './config';

/**
 * OpenAPI 3.1 documentation for the UCP catalog Search and Lookup capabilities,
 * served at `/ucp/v1/openapi.json` and linked from the UCP profile.
 *
 * @param origin absolute origin of this deployment
 */
export function buildUcpOpenApi(origin: string): Record<string, unknown> {
  const price = {
    type: 'object',
    required: ['amount', 'currency'],
    properties: {
      amount: { type: 'integer', description: 'Amount in the currency minor units (e.g. cents).' },
      currency: { type: 'string', description: 'ISO 4217 currency code.' },
    },
  };

  const media = {
    type: 'object',
    required: ['type', 'url'],
    properties: {
      type: { type: 'string', enum: ['image'] },
      url: { type: 'string', format: 'uri' },
      alt_text: { type: 'string' },
    },
  };

  const variant = {
    type: 'object',
    required: ['id', 'title', 'description', 'price', 'availability', 'media'],
    properties: {
      id: { type: 'string' },
      sku: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'object', properties: { plain: { type: 'string' } } },
      url: { type: 'string', format: 'uri' },
      price: { $ref: '#/components/schemas/Price' },
      list_price: { $ref: '#/components/schemas/Price' },
      availability: { type: 'object', properties: { available: { type: 'boolean' } } },
      media: { type: 'array', items: { $ref: '#/components/schemas/Media' } },
      inputs: {
        type: 'array',
        items: {
          type: 'object',
          properties: { id: { type: 'string' }, match: { type: 'string', enum: ['exact', 'featured'] } },
        },
      },
    },
  };

  const product = {
    type: 'object',
    required: ['id', 'title', 'description', 'price_range', 'media', 'variants'],
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'object', properties: { plain: { type: 'string' } } },
      url: { type: 'string', format: 'uri' },
      price_range: {
        type: 'object',
        properties: { min: { $ref: '#/components/schemas/Price' }, max: { $ref: '#/components/schemas/Price' } },
      },
      list_price_range: {
        type: 'object',
        properties: { min: { $ref: '#/components/schemas/Price' }, max: { $ref: '#/components/schemas/Price' } },
      },
      media: { type: 'array', items: { $ref: '#/components/schemas/Media' } },
      variants: { type: 'array', items: { $ref: '#/components/schemas/Variant' } },
      tags: { type: 'array', items: { type: 'string' } },
    },
  };

  return {
    openapi: '3.1.0',
    info: {
      title: 'Intershop UCP Catalog API',
      version: UCP_VERSION,
      description:
        'UCP-conformant, non-transactional catalog Search and Lookup capabilities ' +
        '(dev.ucp.shopping.catalog.search / .lookup) over the Intershop ICM REST API.',
    },
    servers: [{ url: `${origin}${UCP_BASE_PATH}` }],
    paths: {
      '/catalog/search': {
        post: {
          summary: 'Search the catalog (dev.ucp.shopping.catalog.search)',
          operationId: 'catalogSearch',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string', description: 'Free-text search term.' },
                    filters: {
                      type: 'object',
                      properties: {
                        categories: { type: 'array', items: { type: 'string' } },
                        price: {
                          type: 'object',
                          properties: { min: { type: 'integer' }, max: { type: 'integer' } },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        limit: { type: 'integer', minimum: 1, description: 'Page size (default 10, max 50).' },
                        cursor: { type: 'string', description: 'Opaque cursor from a previous response.' },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Matching products.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                      pagination: {
                        type: 'object',
                        properties: {
                          has_next_page: { type: 'boolean' },
                          total_count: { type: 'integer' },
                          cursor: {
                            type: 'string',
                            description: 'Cursor for the next page (present when has_next_page).',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Invalid request payload.' },
          },
        },
      },
      '/catalog/lookup': {
        post: {
          summary: 'Batch lookup by identifier (dev.ucp.shopping.catalog.lookup)',
          operationId: 'catalogLookup',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ids'],
                  properties: { ids: { type: 'array', items: { type: 'string' }, minItems: 1 } },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Resolved products; unknown ids are reported as info messages.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                      messages: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request payload, or `request_too_large` when the id batch exceeds the limit.',
            },
          },
        },
      },
      '/catalog/product': {
        post: {
          summary: 'Single-product detail lookup',
          operationId: 'catalogProduct',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
              },
            },
          },
          responses: {
            '200': {
              description: 'The requested product, or an error envelope when not found.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { product: { $ref: '#/components/schemas/Product' } },
                  },
                },
              },
            },
            '400': { description: 'Invalid request payload.' },
          },
        },
      },
    },
    components: {
      schemas: { Price: price, Media: media, Variant: variant, Product: product },
    },
  };
}
