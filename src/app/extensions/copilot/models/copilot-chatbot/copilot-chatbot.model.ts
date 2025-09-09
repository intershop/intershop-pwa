export interface ChatbotMessage {
  message: string;
  messageId?: string;
  type: 'apiMessage' | 'userMessage';
  usedTools?: ChatbotToolCall[];
}

export interface ChatbotToolCall {
  tool: ChatbotToolTypeNew | ChatbotToolTypeOld;
  toolInput: { [key: string]: string };
  toolOutput?: string;
}

export type ChatbotToolTypeNew =
  | 'PWA_basket'
  | 'PWA_compare_products'
  | 'PWA_navigate_to_page'
  | 'PWA_order_template_actions';

export type ChatbotToolTypeOld =
  | 'product_search'
  | 'product_detail_page'
  | 'get_product_variations'
  | 'open_basket'
  | 'add_product_to_basket'
  | 'remove_product_from_basket'
  | 'compare_products';
