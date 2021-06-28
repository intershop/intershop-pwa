import { Injectable } from '@angular/core';
import { TranslateCompiler } from '@ngx-translate/core';

import { Translations } from './translations.type';

@Injectable()
export class PWATranslateCompiler implements TranslateCompiler {
  /**
   * regular expression for grabbing everything in the form:
   * {{<variable>, plural/select, <case>...<case>}}
   *
   * - beginning and ending double curly braces must always come
   *   together without space in between
   * - cases are matched not greedy (.*?) so the regex finds the
   *   smallest match first (if nested, the inner first)
   * - multi-line support with "/s" at the end
   * - "\s*" captures (and ignores) additional whitespace
   * - matching group at beginning and end to handle remaining text
   */
  private static PLURAL_REGEX = /(.*)\{\{\s*(\w+)\s*,\s*(plural|select)\s*,\s*(.*?\})\s*\}\}(.*)/s;

  /**
   * regular expression for matching provided cases
   *
   * - case can be either provided with "=<value>" or "other"
   * - case template is everything inside curly braces
   * - "\s*" captures (and ignores) additional whitespace
   * - global matching ("/g") must be active to iterate over matches
   */
  private static CASE_REGEX = /(other|=\w+)\s*\{(.*?)\}/g;

  /**
   * regular expression for matching simple variables that
   * have to be replaced
   */
  private static SIMPLE_VARIABLE_REGEX = /\{\{\s*(\w+)\s*\}\}/g;

  private checkIfCompileNeeded(value: string | Function): value is string {
    return typeof value === 'string' && PWATranslateCompiler.PLURAL_REGEX.test(value);
  }

  compile(template: string): string | Function {
    if (this.checkIfCompileNeeded(template)) {
      const match = PWATranslateCompiler.PLURAL_REGEX.exec(template);
      const variable = match[2];
      const cases = match[4];

      // construct map for looking up case templates for incoming values
      const casesMap: Record<string, string> = {};
      let defaultCase: string;
      for (let cm: RegExpExecArray; (cm = PWATranslateCompiler.CASE_REGEX.exec(cases)); ) {
        const c = cm[1];
        if (c.startsWith('=')) {
          casesMap[c.substring(1)] = cm[2];
        } else if (c === 'other') {
          defaultCase = cm[2];
        }
      }

      return (args: Record<string, unknown>) => {
        const value = args?.[variable] ?? '';
        const caseTemplate = casesMap[value?.toString()] ?? defaultCase;
        const caseOutput = caseTemplate?.replace(/#/, value?.toString());
        const result = `${match[1]}${caseOutput}${match[5]}`;

        // if output still contains pluralization, do recursion
        if (PWATranslateCompiler.PLURAL_REGEX.test(result)) {
          return (this.compile(result) as Function)(args);
        }

        // replace all static variable values (if any)
        return result?.replace(PWATranslateCompiler.SIMPLE_VARIABLE_REGEX, (_, repl) => args?.[repl]?.toString() ?? '');
      };
    }

    return template;
  }

  compileTranslations(translations: Translations): Translations {
    return Object.entries(translations)
      .map<[string, string | Function]>(([key, value]) => {
        if (this.checkIfCompileNeeded(value)) {
          return [key, this.compile(value)];
        }
        return [key, value];
      })
      .reduce<Translations>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }
}
