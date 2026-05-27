export interface ChatbotMessage {
  message: string;
  messageId?: string;
  type: 'apiMessage' | 'userMessage';
  usedTools?: ChatbotToolCall[];
}

export interface ChatbotToolCall {
  tool: string;
  toolInput: Record<string, string>;
  toolOutput?: string;
}
