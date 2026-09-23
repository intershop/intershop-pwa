import { ProductAdvisorToolCall } from '../product-advisor/product-advisor.model';

import { extractChoicePromptFromToolCalls } from './product-advisor-choice.helper';

describe('Product Advisor Choice Helper', () => {
  it('should return undefined when there are no tool calls', () => {
    expect(extractChoicePromptFromToolCalls(undefined)).toBeUndefined();
    expect(extractChoicePromptFromToolCalls([])).toBeUndefined();
  });

  it('should ignore tools that are not PWA_ask_choice', () => {
    const tools: ProductAdvisorToolCall[] = [{ tool: 'icmSearch', toolInput: {} }];

    expect(extractChoicePromptFromToolCalls(tools)).toBeUndefined();
  });

  it('should parse a single-select prompt from a pipe-separated options string', () => {
    const tools: ProductAdvisorToolCall[] = [
      {
        tool: 'PWA_ask_choice',
        toolInput: { question: 'How do these employees mainly work?', options: 'In the office|Hybrid|Mobile' },
      },
    ];

    expect(extractChoicePromptFromToolCalls(tools)).toEqual({
      question: 'How do these employees mainly work?',
      options: ['In the office', 'Hybrid', 'Mobile'],
      multiSelect: false,
    });
  });

  it('should parse a multi-select prompt and accept an options array', () => {
    const tools: ProductAdvisorToolCall[] = [
      {
        tool: 'PWA_ask_choice',
        toolInput: { question: 'Which products?', options: ['Headset', 'Monitor'], multiSelect: true },
      },
    ];

    expect(extractChoicePromptFromToolCalls(tools)).toEqual({
      question: 'Which products?',
      options: ['Headset', 'Monitor'],
      multiSelect: true,
    });
  });

  it('should treat the string "true" as multiSelect', () => {
    const tools: ProductAdvisorToolCall[] = [
      { tool: 'PWA_ask_choice', toolInput: { options: 'A|B', multiSelect: 'true' } },
    ];

    expect(extractChoicePromptFromToolCalls(tools)?.multiSelect).toBeTrue();
  });

  it('should trim options and drop empty ones', () => {
    const tools: ProductAdvisorToolCall[] = [{ tool: 'PWA_ask_choice', toolInput: { options: ' A | | B  |' } }];

    expect(extractChoicePromptFromToolCalls(tools)?.options).toEqual(['A', 'B']);
  });

  it('should return undefined when there are no usable options', () => {
    const tools: ProductAdvisorToolCall[] = [
      { tool: 'PWA_ask_choice', toolInput: { question: 'Empty?', options: ' | ' } },
    ];

    expect(extractChoicePromptFromToolCalls(tools)).toBeUndefined();
  });

  it('should omit an empty question', () => {
    const tools: ProductAdvisorToolCall[] = [{ tool: 'PWA_ask_choice', toolInput: { question: '  ', options: 'A|B' } }];

    expect(extractChoicePromptFromToolCalls(tools)?.question).toBeUndefined();
  });
});
