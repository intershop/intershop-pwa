import { htmlToMarkdown } from './html-to-markdown';

describe('Html To Markdown', () => {
  const wrapInMain = (inner: string): string =>
    `<html><body><header>chrome</header><main id="main-content">${inner}</main><footer>chrome</footer></body></html>`;

  it('should convert basic main content to markdown when given a full page', () => {
    const result = htmlToMarkdown(wrapInMain('<h1>Title</h1><p>Hello world</p>'));

    expect(result).toMatchInlineSnapshot(`
      "# Title

      Hello world"
    `);
  });

  it('should ignore page chrome outside of main content when converting', () => {
    const result = htmlToMarkdown(wrapInMain('<p>content</p>'));

    expect(result).not.toContain('chrome');
  });

  it('should fall back to the body when no main content element is present', () => {
    const result = htmlToMarkdown('<html><body><p>only body</p></body></html>');

    expect(result).toEqual('only body');
  });

  it('should extract the full main content when literal "</main>" text appears before the real closing tag', () => {
    // DOM parsing (not regex slicing) is required to keep the trailing paragraph
    const result = htmlToMarkdown(wrapInMain('<p>before &lt;/main&gt; text</p><p>after</p>'));

    expect(result).toContain('after');
  });

  it('should strip non-content elements when converting', () => {
    const result = htmlToMarkdown(
      wrapInMain('<p>keep</p><script>drop()</script><button>drop</button><ish-breadcrumb>drop</ish-breadcrumb>')
    );

    expect(result).toEqual('keep');
  });

  it('should remove images when converting', () => {
    const result = htmlToMarkdown(wrapInMain('<p>text <img src="/foo.png" alt="foo"></p>'));

    expect(result).toEqual('text');
  });

  it('should rewrite internal app links to their markdown mirror when converting', () => {
    const result = htmlToMarkdown(wrapInMain('<a href="/en_US/home">Home</a>'));

    expect(result).toEqual('[Home](/en_US/home.md)');
  });

  it('should preserve query and fragment when rewriting internal links', () => {
    const result = htmlToMarkdown(wrapInMain('<a href="/en_US/search?q=shoes#top">Search</a>'));

    expect(result).toEqual('[Search](/en_US/search.md?q=shoes#top)');
  });

  it.each(['//external.example/page', '/INTERSHOP/static/img', '/assets/logo', '/already.md'])(
    'should not rewrite non-app link "%s" when converting',
    href => {
      const result = htmlToMarkdown(wrapInMain(`<a href="${href}">Link</a>`));

      expect(result).toEqual(`[Link](${href})`);
    }
  );

  it('should drop anchors pointing to fragments, javascript or mailto but keep their text', () => {
    const result = htmlToMarkdown(
      wrapInMain('<a href="#top">Top</a> <a href="mailto:a@b.c">Mail</a> <a href="javascript:void(0)">JS</a>')
    );

    expect(result).toEqual('Top Mail JS');
  });

  it('should drop empty list markers left after stripping non-content children', () => {
    const result = htmlToMarkdown(wrapInMain('<ul><li><button>x</button></li><li>keep</li></ul>'));

    expect(result).toEqual('-   keep');
  });

  it('should remove orphan form labels when converting', () => {
    const result = htmlToMarkdown(wrapInMain('<p>content</p><label>Quantity</label>'));

    expect(result).toEqual('content');
  });

  it('should remove the tab navigation strip but keep the tab content', () => {
    const result = htmlToMarkdown(
      wrapInMain('<nav role="tablist"><a>Description</a><a>Reviews</a></nav><p>the description</p>')
    );

    expect(result).toEqual('the description');
  });

  it('should remove the filter and category navigation when converting', () => {
    const result = htmlToMarkdown(
      wrapInMain(
        '<ish-filter-navigation><a href="/en/x">Filter</a></ish-filter-navigation>' +
          '<ish-category-navigation><a href="/en/y">Nav</a></ish-category-navigation><p>body</p>'
      )
    );

    expect(result).toEqual('body');
  });

  it('should render the breadcrumb as a single trail with .md ancestor links', () => {
    const result = htmlToMarkdown(
      wrapInMain(
        '<ish-breadcrumb><nav><ol>' +
          '<li><a href="/en/home">Home</a></li>' +
          '<li><a href="/en/computers-ctgComputers">Computers</a></li>' +
          '<li class="active" aria-current="page">Surface Book 2</li>' +
          '</ol></nav></ish-breadcrumb>'
      )
    );

    expect(result).toEqual('[Home](/en/home.md) > [Computers](/en/computers-ctgComputers.md) > Surface Book 2');
  });

  it('should convert a star rating widget to an explicit numeric rating', () => {
    const result = htmlToMarkdown(
      wrapInMain('<ngb-rating aria-valuenow="2" aria-valuemax="5"><span>*</span></ngb-rating>')
    );

    expect(result).toEqual('Rating: 2/5');
  });

  it('should keep a space between an inline product link and its rating', () => {
    const result = htmlToMarkdown(
      wrapInMain('<a href="/en/p">Prod</a><ngb-rating aria-valuenow="3" aria-valuemax="5"><span>*</span></ngb-rating>')
    );

    expect(result).toEqual('[Prod](/en/p.md) Rating: 3/5');
  });

  it('should space the review count off the rating', () => {
    const result = htmlToMarkdown(
      wrapInMain('<ngb-rating aria-valuenow="4" aria-valuemax="5"><span>*</span></ngb-rating><span>(1)</span>')
    );

    expect(result).toEqual('Rating: 4/5 (1)');
  });

  it('should drop pagination arrow glyphs but keep numbered page links', () => {
    const result = htmlToMarkdown(
      wrapInMain(
        '<ul><li>\u00ab</li><li><a href="/en/x?page=1">1</a></li>' +
          '<li><a href="/en/x?page=2">2</a></li><li><a href="/en/x?page=2">\u00bb</a></li></ul>'
      )
    );

    expect(result).toEqual('-   [1](/en/x.md?page=1)\n-   [2](/en/x.md?page=2)');
  });

  it('should unwrap headings that end up inside link text', () => {
    const result = htmlToMarkdown(wrapInMain('<a href="/en/cat"><h2>Tablets</h2></a>'));

    expect(result).toEqual('[Tablets](/en/cat.md)');
  });

  it('should insert a separator between glued label/value span pairs', () => {
    const result = htmlToMarkdown(
      wrapInMain(
        '<div><span class="product-variation-info span-separator">Hard drive size</span><span>256GB</span></div>'
      )
    );

    expect(result).toEqual('Hard drive size: 256GB');
  });

  it('should render a definition list as compact "Term: Definition" bullets', () => {
    const result = htmlToMarkdown(
      wrapInMain(
        '<dl class="product-attributes">' +
          '<dt class="attribute-type">Warranty:</dt><dd class="attribute-value">1-year limited</dd>' +
          '<dt class="attribute-type">Memory:</dt><dd class="attribute-value">16GB RAM</dd>' +
          '</dl>'
      )
    );

    expect(result).toEqual('- Warranty: 1-year limited\n- Memory: 16GB RAM');
  });

  it('should prefix a tab panel with its tab label as a heading via aria-labelledby', () => {
    const result = htmlToMarkdown(
      wrapInMain(
        '<nav role="tablist"><a id="t1" role="tab">Details</a></nav>' +
          '<div class="tab-content"><div role="tabpanel" aria-labelledby="t1"><p>the details</p></div></div>'
      )
    );

    expect(result).toEqual('## Details\n\nthe details');
  });

  it('should fall back to a title heading when the main content converts to nothing', () => {
    const html =
      '<html><head><title>Sign in | Intershop PWA</title></head>' +
      '<body><main id="main-content"><form><label>Email</label><input></form></main></body></html>';

    expect(htmlToMarkdown(html)).toEqual('# Sign in');
  });

  it('should prefer real main content over the title heading fallback', () => {
    const html =
      '<html><head><title>Home | Intershop PWA</title></head>' +
      '<body><main id="main-content"><p>welcome</p></main></body></html>';

    expect(htmlToMarkdown(html)).toEqual('welcome');
  });

  it('should not pull page chrome into the mirror when the main content is empty', () => {
    const html =
      '<html><head><title>Empty | Intershop PWA</title></head>' +
      '<body><header>chrome</header><main id="main-content"></main><footer>chrome</footer></body></html>';

    expect(htmlToMarkdown(html)).toEqual('# Empty');
  });

  it.each(['iframe', 'noscript', 'select', 'textarea', 'form', 'svg', 'style'])(
    'should remove <%s> elements when converting',
    tag => {
      const result = htmlToMarkdown(wrapInMain(`<p>keep</p><${tag}>drop</${tag}>`));

      expect(result).toEqual('keep');
    }
  );

  it.each([
    '<span aria-hidden="true">drop</span>',
    '<span hidden>drop</span>',
    '<span data-nosnippet>drop</span>',
    '<span class="visually-hidden">drop</span>',
    '<span class="sr-only">drop</span>',
    '<a class="skip-link" href="/en/x">drop</a>',
  ])('should remove non-content element %s when converting', markup => {
    const result = htmlToMarkdown(wrapInMain(`<p>keep</p>${markup}`));

    expect(result).toEqual('keep');
  });

  it('should not escape inline markdown characters (relaxed escaping)', () => {
    const result = htmlToMarkdown(wrapInMain('<p>product_id and 2*3 and version 4.5</p>'));

    expect(result).toEqual('product_id and 2*3 and version 4.5');
  });

  it('should still escape block-level markdown constructs at the start of a line', () => {
    const result = htmlToMarkdown(wrapInMain('<p># not a heading</p>'));

    expect(result).toEqual('\\# not a heading');
  });

  it('should not escape line-start list-like markers (leaves CMS dashes as-is)', () => {
    const result = htmlToMarkdown(wrapInMain('<p>- dash start</p>'));

    expect(result).toEqual('- dash start');
  });

  it('should normalize non-breaking spaces to regular spaces', () => {
    const result = htmlToMarkdown(wrapInMain('<p>a&nbsp;b</p>'));

    expect(result).toEqual('a b');
  });

  it('should drop links that have no visible text after stripping', () => {
    const result = htmlToMarkdown(wrapInMain('<a href="/en/y"><img src="/i.png" alt="icon"></a><p>keep</p>'));

    expect(result).toEqual('keep');
  });
});
