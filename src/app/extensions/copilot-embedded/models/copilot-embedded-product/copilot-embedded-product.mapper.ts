import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

import { CopilotEmbeddedProductData } from './copilot-embedded-product.interface';
import { CopilotEmbeddedProduct } from './copilot-embedded-product.model';

/**
 * Raw `icmSearch` tool output: products are grouped by promotions under `output`.
 */
interface CopilotEmbeddedProductSearchOutput {
  output?: { products?: CopilotEmbeddedProductData[] }[];
}

const SEARCH_TOOL = 'icmSearch';

export class CopilotEmbeddedProductMapper {
  /**
   * Maps the `icmSearch` tool outputs of a chatflow response (JSON strings with promotion-grouped products)
   * to a flat product list. Invalid output is ignored. Products found by several searches are only listed
   * once (first occurrence wins).
   *
   * @param tools The tool calls of a chatflow response (`usedTools`).
   */
  static fromToolCalls(tools: CopilotEmbeddedToolCall[]): CopilotEmbeddedProduct[] {
    const products = (tools ?? [])
      .filter(tool => tool?.tool === SEARCH_TOOL && !!tool.toolOutput)
      .flatMap(tool => CopilotEmbeddedProductMapper.fromSearchOutput(tool.toolOutput));
    return products.filter((product, index) => products.findIndex(p => p.sku === product.sku) === index);
  }

  private static fromData(data: CopilotEmbeddedProductData): CopilotEmbeddedProduct {
    return {
      sku: data?.sku,
      title: data?.title,
      price: typeof data?.price === 'number' ? data.price : undefined,
      currency: data?.currency ?? undefined,
      imageUrl: data?.mainImage ?? undefined,
      shortDescription: data?.shortDescription ?? undefined,
      manufacturer: data?.manufacturer ?? undefined,
    };
  }

  private static fromSearchOutput(toolOutput: string): CopilotEmbeddedProduct[] {
    try {
      const parsed = JSON.parse(toolOutput) as CopilotEmbeddedProductSearchOutput;
      return (parsed?.output ?? [])
        .flatMap(group => group?.products ?? [])
        .map(CopilotEmbeddedProductMapper.fromData)
        .filter(product => !!product.sku);
    } catch {
      return [];
    }
  }
}
