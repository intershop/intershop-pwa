import { CopilotEmbeddedProduct } from '../copilot-embedded-product/copilot-embedded-product.model';
import { CopilotEmbeddedToolCall } from '../copilot-embedded/copilot-embedded.model';

/** Raw product shape returned inside the `icmSearch` tool output. */
interface IcmSearchRawProduct {
  sku?: string;
  title?: string;
  price?: null | number;
  currency?: null | string;
  mainImage?: null | string;
  shortDescription?: null | string;
  manufacturer?: null | string;
}

/** Raw `icmSearch` tool output: products are grouped by promotions under `output`. */
interface IcmSearchOutput {
  output?: { products?: IcmSearchRawProduct[] }[];
}

/**
 * Extracts the recommended products from a chatflow's tool calls.
 *
 * Reads the `icmSearch` tool output (a JSON string with promotion-grouped products) and flattens it
 * into a simple product list. Unknown/invalid output is ignored. Products found by several searches
 * are only listed once (first occurrence wins).
 *
 * @param tools The tool calls of a chatflow response (`usedTools`).
 */
export function extractProductsFromToolCalls(tools: CopilotEmbeddedToolCall[] | undefined): CopilotEmbeddedProduct[] {
  const products = (tools ?? [])
    .filter(tool => tool?.tool === 'icmSearch' && !!tool.toolOutput)
    .flatMap(tool => parseIcmSearchOutput(tool.toolOutput));
  return products.filter((product, index) => products.findIndex(p => p.sku === product.sku) === index);
}

function parseIcmSearchOutput(toolOutput: string): CopilotEmbeddedProduct[] {
  try {
    const parsed = JSON.parse(toolOutput) as IcmSearchOutput;
    return (parsed?.output ?? [])
      .flatMap(group => group?.products ?? [])
      .map(mapProduct)
      .filter(product => !!product.sku);
  } catch {
    return [];
  }
}

function mapProduct(product: IcmSearchRawProduct): CopilotEmbeddedProduct {
  return {
    sku: product?.sku,
    title: product?.title,
    price: typeof product?.price === 'number' ? product.price : undefined,
    currency: product?.currency ?? undefined,
    imageUrl: product?.mainImage ?? undefined,
    shortDescription: product?.shortDescription ?? undefined,
    manufacturer: product?.manufacturer ?? undefined,
  };
}
