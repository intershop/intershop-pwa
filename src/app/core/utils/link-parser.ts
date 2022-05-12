export class LinkParser {
  private static linkRegexp = /^(unsafe:)?([a-z]+):\/\/(.*?)(@.*)?$/;

  // eslint-disable-next-line complexity
  static parseLink(link: string, baseHref?: string): string {
    if (LinkParser.linkRegexp.test(link)) {
      const [, , protocol, value, unitName] = LinkParser.linkRegexp.exec(link);

      const prefix = !baseHref || baseHref === '/' ? '' : baseHref;

      switch (protocol) {
        case 'product':
          // TODO: use ProductRoutePipe for SEO URLs
          return `${prefix}/product/${value}`;
        case 'category':
          // TODO: use CategoryRoutePipe for SEO URLs
          return `${prefix}/categoryref/${value}${unitName}`;
        case 'page':
          // CMS managed pages link
          // TODO: use ContentPageRoutePipe for SEO URLs
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
          // eslint-disable-next-line no-console
          console.log('Unknown link type:', link);
      }
    }
    return link;
  }
}
