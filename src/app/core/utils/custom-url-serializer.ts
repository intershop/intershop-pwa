import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

/**
 * Custom serializer for allowing parenthesis in URLs
 *
 * taken from: https://github.com/angular/angular/issues/10280#issuecomment-309129784
 */
export class CustomUrlSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    const newUrl = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
    return this.defaultUrlSerializer.parse(newUrl);
  }

  serialize(tree: UrlTree): string {
    return this.defaultUrlSerializer.serialize(tree).replace(/%28/g, '(').replace(/%29/g, ')');
  }
}
