import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

import { CopilotEmbeddedAnswerMapper } from './copilot-embedded-answer.mapper';

describe('Copilot Embedded Answer Mapper', () => {
  const usedTools: CopilotEmbeddedToolCall[] = [
    {
      tool: 'icmSearch',
      toolInput: {},
      toolOutput: JSON.stringify({ output: [{ products: [{ sku: 'product-1' }] }] }),
    },
    { tool: 'PWA_ask_choice', toolInput: { options: 'A|B' } },
  ];

  describe('fromData', () => {
    it('should map a chatflow response to an answer with products and choices', () => {
      expect(
        CopilotEmbeddedAnswerMapper.fromData({ text: 'Hi', chatId: 'chat-1', chatMessageId: 'msg-1', usedTools })
      ).toEqual({
        text: 'Hi',
        chatId: 'chat-1',
        messageId: 'msg-1',
        usedTools,
        products: [expect.objectContaining({ sku: 'product-1' })],
        choices: { question: undefined, options: ['A', 'B'], multiSelect: false },
      });
    });

    it('should map a response without tool calls', () => {
      expect(CopilotEmbeddedAnswerMapper.fromData({ text: 'Hi' })).toEqual({
        text: 'Hi',
        chatId: undefined,
        messageId: undefined,
        usedTools: [],
        products: [],
        choices: undefined,
      });
    });
  });

  describe('fromStreamEvent', () => {
    const empty = CopilotEmbeddedAnswerMapper.fromData({ text: '' });

    it('should append tokens to the answer text', () => {
      const answer = CopilotEmbeddedAnswerMapper.fromStreamEvent(empty, { event: 'token', data: 'A ' });

      expect(CopilotEmbeddedAnswerMapper.fromStreamEvent(answer, { event: 'token', data: 'answer' }).text).toBe(
        'A answer'
      );
    });

    it('should map streamed tool calls', () => {
      const answer = CopilotEmbeddedAnswerMapper.fromStreamEvent(empty, { event: 'usedTools', data: usedTools });

      expect(answer.usedTools).toEqual(usedTools);
      expect(answer.products.map(product => product.sku)).toEqual(['product-1']);
      expect(answer.choices?.options).toEqual(['A', 'B']);
    });

    it('should take the chat ID from the metadata', () => {
      expect(
        CopilotEmbeddedAnswerMapper.fromStreamEvent(empty, { event: 'metadata', data: { chatId: 'chat-2' } }).chatId
      ).toBe('chat-2');
    });

    it('should return the answer unchanged for other events', () => {
      expect(CopilotEmbeddedAnswerMapper.fromStreamEvent(empty, { event: 'start', data: '' })).toBe(empty);
    });
  });
});
