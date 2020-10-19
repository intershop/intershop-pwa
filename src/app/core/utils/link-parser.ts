export class LinkParser {
  private static linkRegexp = /^(unsafe:)?([a-z]+):\/\/(.*?)(@.*)?$/;

  static parseLink(link: string, baseHref?: string): string {
    if (LinkParser.linkRegexp.test(link)) {
      const [, , protocol, value] = LinkParser.linkRegexp.exec(link);

      const prefix = !baseHref || baseHref === '/' ? '' : baseHref;

      switch (protocol) {
        case 'product':
          // TODO: for consistent product links it should have the default category in the route
          // TODO: use ProductRoutePipe
          return `${prefix}/sku${value}`;
        case 'category':
          // TODO: the configuration parameter currently only works for first level categories
          // TODO: use CategoryRoutePipe
          return `${prefix}/cat${value}`;
        case 'page':
          // CMS managed pages link
          return `${prefix}/page/${value}`;
        case 'route':
          // direct router links for the PWA
          return `${prefix}/${value}`;
        case 'http':
        case 'https':
        case 'javascript':
          // external links are not changed
          return link;
        default:
          // tslint:disable-next-line:no-console
          console.log('Unknown link type:', link);
      }
    }
    return link;
  }
}
