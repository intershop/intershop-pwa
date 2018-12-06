import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';
import { ContentConfigurationParameterMapper } from './content-configuration-parameter.mapper';

describe('Content Configuration Parameter Mapper', () => {
  it('should return a value for undefined input', () => {
    const result = ContentConfigurationParameterMapper.fromData(undefined);
    expect(result).not.toBeUndefined();
    expect(result).toBeEmpty();
  });

  it('should map to simple dictionary', () => {
    const input: { [name: string]: ContentConfigurationParameterData } = {
      key1: {
        definitionQualifiedName: 'name1',
        value: '1',
      },
      key2: {
        definitionQualifiedName: 'name2',
        value: 'hello',
      },
      key3: {
        definitionQualifiedName: 'name3',
        value: ['hello', 'world'],
      },
    };

    const result = ContentConfigurationParameterMapper.fromData(input);
    expect(result).not.toBeEmpty();
    expect(result).toHaveProperty('key1', '1');
    expect(result).toHaveProperty('key2', 'hello');
    expect(result).toHaveProperty('key3', ['hello', 'world']);
    expect(result).toMatchSnapshot();
  });
});
