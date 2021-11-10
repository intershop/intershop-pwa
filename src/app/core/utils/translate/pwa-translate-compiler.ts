import { Injectable, Injector, isDevMode } from '@angular/core';
import { TranslateCompiler, TranslateService } from '@ngx-translate/core';

import { Translations } from './translations.type';

const cache: Record<string, Function> = {};

@Injectable()
export class PWATranslateCompiler implements TranslateCompiler {
  constructor(private injector: Injector) {}

  private static MAX_COMPILATION_LENGTH = 1000;

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
   * regular expression for grabbing everything in the form:
   * {{(<variable>,)? translate, <key>(, <variable-rename>)?}}
   * - beginning and ending double curly braces must always come
   *   together without space in between
   * - multi-line support with "/s" at the end
   * - "\s*" captures (and ignores) additional whitespace
   * - matching group at beginning and end to handle remaining text
   */
  private static TRANSLATE_REGEX = /(.*)\{\{\s*(\w*)\s*,?\s*translate\s*,\s*(.*?)\s*\}\}(.*)/s;

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

  private checkIfCompileNeeded(value: string | Function): boolean {
    return (
      typeof value === 'string' &&
      (PWATranslateCompiler.PLURAL_REGEX.test(value) || PWATranslateCompiler.TRANSLATE_REGEX.test(value))
    );
  }

  private recurse(template: string, args: Record<string, unknown>) {
    // if output still contains pluralization, do recursion
    if (this.checkIfCompileNeeded(template)) {
      return (this.compile(template) as Function)(args);
    }

    // replace all static variable values (if any)
    return template?.replace(PWATranslateCompiler.SIMPLE_VARIABLE_REGEX, (_, repl) => args?.[repl]?.toString() ?? '');
  }

  private doCompile(template: string): Function {
    if (PWATranslateCompiler.PLURAL_REGEX.test(template)) {
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

        return this.recurse(result, args);
      };
    } else if (PWATranslateCompiler.TRANSLATE_REGEX.test(template)) {
      const match = PWATranslateCompiler.TRANSLATE_REGEX.exec(template);
      const variable = match[2];
      const key = match[3].split(',')[0].trim();
      const rename = match[3].split(',')?.[1]?.trim();

      return (args: Record<string, unknown>) => {
        if (rename) {
          args[rename] = args[variable];
        }
        const delegate = this.injector.get(TranslateService).instant(key, args);
        const result = `${match[1]}${delegate}${match[4]}`;

        return this.recurse(result, args);
      };
    } else {
      return (args: Record<string, unknown>) => this.recurse(template, args);
    }
  }

  compile(template: string): string | Function {
    if (this.sanityCheck(template) && this.checkIfCompileNeeded(template)) {
      if (!cache[template]) {
        cache[template] = this.doCompile(template);
      }
      return cache[template];
    }

    return template;
  }

  private sanityCheck(value: string | Function): boolean {
    const sane = typeof value !== 'string' || value.length <= PWATranslateCompiler.MAX_COMPILATION_LENGTH;
    if (isDevMode() && !sane) {
      console.warn(
        `Not compiling translation with value '${(value as string).substring(
          0,
          20
        )}'... as it is too big! - Use CMS! - This is a development mode only warning and can be ignored if the behavior is intended.`
      );
    }
    return sane;
  }

  compileTranslations(translations: Translations): Translations {
    // This implementation is mutable by intention
    // tslint:disable-next-line: forin - object does not have inherited properties
    for (const key in translations) {
      translations[key] = this.compile(translations[key] as string);
    }
    return translations;
  }
}
