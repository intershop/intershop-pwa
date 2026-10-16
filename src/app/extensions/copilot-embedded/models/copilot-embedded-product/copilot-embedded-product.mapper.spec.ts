import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

import { CopilotEmbeddedProductMapper } from './copilot-embedded-product.mapper';

describe('Copilot Embedded Product Mapper', () => {
  it('should return an empty array when there are no tool calls', () => {
    expect(CopilotEmbeddedProductMapper.fromToolCalls(undefined)).toBeEmpty();
    expect(CopilotEmbeddedProductMapper.fromToolCalls([])).toBeEmpty();
  });

  it('should ignore tools that are not icmSearch', () => {
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'product_detail_page', toolInput: {}, toolOutput: '{}' }];

    expect(CopilotEmbeddedProductMapper.fromToolCalls(tools)).toBeEmpty();
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

    const products = CopilotEmbeddedProductMapper.fromToolCalls(tools);

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

  it('should list products found by several searches only once', () => {
    const toolOutput = (skus: string[]) =>
      JSON.stringify({ output: [{ products: skus.map(sku => ({ sku, title: `Product ${sku}` })) }] });
    const tools: CopilotEmbeddedToolCall[] = [
      { tool: 'icmSearch', toolInput: { query: 'storage' }, toolOutput: toolOutput(['1', '2']) },
      { tool: 'icmSearch', toolInput: { query: 'networking' }, toolOutput: toolOutput(['2', '3', '3']) },
    ];

    expect(CopilotEmbeddedProductMapper.fromToolCalls(tools).map(product => product.sku)).toEqual(['1', '2', '3']);
  });

  it('should ignore invalid tool output', () => {
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'icmSearch', toolInput: {}, toolOutput: 'not json' }];

    expect(CopilotEmbeddedProductMapper.fromToolCalls(tools)).toBeEmpty();
  });
});
