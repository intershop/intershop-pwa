import { CopilotEmbeddedToolCall } from '../copilot-embedded/copilot-embedded.model';

import { extractProductsFromToolCalls } from './copilot-embedded-product.helper';

describe('Copilot Embedded Product Helper', () => {
  it('should return an empty array when there are no tool calls', () => {
    expect(extractProductsFromToolCalls(undefined)).toBeEmpty();
    expect(extractProductsFromToolCalls([])).toBeEmpty();
  });

  it('should ignore tools that are not icmSearch', () => {
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'product_detail_page', toolInput: {}, toolOutput: '{}' }];

    expect(extractProductsFromToolCalls(tools)).toBeEmpty();
  });

  it('should flatten promotion-grouped products from the icmSearch output', () => {
    const toolOutput = JSON.stringify({
      showOnPWA: 'true',
      query: 'gaming laptop',
      output: [
        {
          promotions: [],
          products: [
            {
              sku: '3711534',
              title: 'Gaming Headset',
              price: 37.95,
              currency: 'USD',
              mainImage: 'https://example.org/3711534.jpg',
              shortDescription: 'A headset',
              manufacturer: 'Hercules',
            },
          ],
        },
        { promotions: ['SALE'], products: [{ sku: '5767008', title: 'Adapter' }] },
      ],
    });
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'icmSearch', toolInput: {}, toolOutput }];

    const products = extractProductsFromToolCalls(tools);

    expect(products).toHaveLength(2);
    expect(products[0]).toEqual({
      sku: '3711534',
      title: 'Gaming Headset',
      price: 37.95,
      currency: 'USD',
      imageUrl: 'https://example.org/3711534.jpg',
      shortDescription: 'A headset',
      manufacturer: 'Hercules',
    });
    expect(products[1].sku).toEqual('5767008');
  });

  it('should ignore invalid tool output', () => {
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'icmSearch', toolInput: {}, toolOutput: 'not json' }];

    expect(extractProductsFromToolCalls(tools)).toBeEmpty();
  });
});
