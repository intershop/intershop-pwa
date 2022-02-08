import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

/**
 * Custom serializer for allowing parenthesis in URLs and removing matrix parameters
 *
 * taken from: https://github.com/angular/angular/issues/10280#issuecomment-309129784
 */
export class PWAUrlSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    const newUrl = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
    return this.defaultUrlSerializer.parse(newUrl);
  }

  serialize(tree: UrlTree): string {
    return (
      this.defaultUrlSerializer
        .serialize(tree)
        // display parenthesis unencoded in URL
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
        // remove matrix parameters
        .replace(/;[^?]*/, '')
    );
  }
}
