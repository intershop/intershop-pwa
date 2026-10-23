import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

import { CopilotEmbeddedChoiceMapper } from './copilot-embedded-choice.mapper';

describe('Copilot Embedded Choice Mapper', () => {
  it('should return undefined when there are no tool calls', () => {
    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(undefined)).toBeUndefined();
    expect(CopilotEmbeddedChoiceMapper.fromToolCalls([])).toBeUndefined();
  });

  it('should ignore tools that are not PWA_ask_choice', () => {
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'icmSearch', toolInput: {} }];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)).toBeUndefined();
  });

  it('should parse a single-select prompt from a pipe-separated options string', () => {
    const tools: CopilotEmbeddedToolCall[] = [
      {
        tool: 'PWA_ask_choice',
        toolInput: { question: 'How do these employees mainly work?', options: 'In the office|Hybrid|Mobile' },
      },
    ];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)).toEqual({
      question: 'How do these employees mainly work?',
      options: ['In the office', 'Hybrid', 'Mobile'],
      multiSelect: false,
    });
  });

  it('should parse a multi-select prompt and accept an options array', () => {
    const tools: CopilotEmbeddedToolCall[] = [
      {
        tool: 'PWA_ask_choice',
        toolInput: { question: 'Which products?', options: ['Headset', 'Monitor'], multiSelect: true },
      },
    ];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)).toEqual({
      question: 'Which products?',
      options: ['Headset', 'Monitor'],
      multiSelect: true,
    });
  });

  it('should treat the string "true" as multiSelect', () => {
    const tools: CopilotEmbeddedToolCall[] = [
      { tool: 'PWA_ask_choice', toolInput: { options: 'A|B', multiSelect: 'true' } },
    ];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)?.multiSelect).toBeTrue();
  });

  it('should trim options and drop empty ones', () => {
    const tools: CopilotEmbeddedToolCall[] = [{ tool: 'PWA_ask_choice', toolInput: { options: ' A | | B  |' } }];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)?.options).toEqual(['A', 'B']);
  });

  it('should return undefined when there are no usable options', () => {
    const tools: CopilotEmbeddedToolCall[] = [
      { tool: 'PWA_ask_choice', toolInput: { question: 'Empty?', options: ' | ' } },
    ];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)).toBeUndefined();
  });

  it('should omit an empty question', () => {
    const tools: CopilotEmbeddedToolCall[] = [
      { tool: 'PWA_ask_choice', toolInput: { question: '  ', options: 'A|B' } },
    ];

    expect(CopilotEmbeddedChoiceMapper.fromToolCalls(tools)?.question).toBeUndefined();
  });
});
