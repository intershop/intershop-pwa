export class LinkParser {
  private static linkRegexp = /^(unsafe:)?([a-z]+):\/\/(.*?)(@.*)?$/;

  static parseLink(link: string): string {
    if (LinkParser.linkRegexp.test(link)) {
      const [, , protocol, value] = LinkParser.linkRegexp.exec(link);

      switch (protocol) {
        case 'product':
          // TODO: for consistent product links it should have the default category in the route
          // TODO: use ProductRoutePipe
          return `/product/${value}`;
        case 'category':
          // TODO: the configuration parameter currently only works for first level categories
          // TODO: use CategoryRoutePipe
          return `/category/${value}`;
        case 'page':
          // CMS managed pages link
          return `/page/${value}`;
        case 'route':
          // direct router links for the PWA
          return `/${value}`;
        case 'http':
        case 'https':
          // absolut links, mainly external links, are not changed
          return link;
        default:
          // tslint:disable-next-line:no-console
          console.log('Unknown link type:', link);
      }
    }
    return link;
  }
}
