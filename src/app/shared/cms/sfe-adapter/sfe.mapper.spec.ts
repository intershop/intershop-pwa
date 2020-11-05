import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import {
  ContentPageletView,
  createContentPageletEntryPointView,
  createContentPageletView,
} from 'ish-core/models/content-view/content-view.model';
import { createDocumentFromHTML } from 'ish-core/utils/dev/html-query-utils';

import { domDataProvider, htmlComplex, reducedTreeComplex } from './dev/sfe.mapper.spec.dom-data';
import { SfeMapper } from './sfe.mapper';

describe('Sfe Mapper', () => {
  describe('tree mappings with getDomTree and reduceDomTree', () => {
    it.each(domDataProvider)(
      `should extract the tree structure for DOM with %s`,
      // tslint:disable-next-line:no-any
      (_, data: { html: string; tree: any; reducedTree: any }) => {
        const dom = createDocumentFromHTML(data.html).querySelector('body').firstChild;
        const tree = SfeMapper.getDomTree(dom);

        expect(tree).toEqual(data.tree);
      }
    );

    it.each(domDataProvider)(
      `should reduce the tree structure for %s`,
      // tslint:disable-next-line:no-any
      (_, data: { html: string; tree: any; reducedTree: any }) => {
        const reducedTree = SfeMapper.reduceDomTree(data.tree);

        expect(reducedTree).toEqual(data.reducedTree);
      }
    );

    it('should create reduced tree for complex DOM', () => {
      const dom = createDocumentFromHTML(htmlComplex).querySelector('body').firstChild;
      const tree = SfeMapper.getDomTree(dom);
      const reducedTree = SfeMapper.reduceDomTree(tree);

      expect(reducedTree).toEqual(reducedTreeComplex);
    });
  });

  describe('sfeMetadata Mappings', () => {
    let include: ContentPageletEntryPoint;
    let pagelet: ContentPageletView;

    beforeEach(() => {
      include = {
        id: 'include',
        definitionQualifiedName: 'ifq',
        domain: 'idomain',
        resourceSetId: 'iresId',
        displayName: 'name',
        pageletIDs: ['p1'],
        configurationParameters: {
          ikey1: '1',
          ikey2: 'true',
          ikey3: ['hello', 'world'],
          ikey4: { test: 'hello' },
        },
      };

      pagelet = createContentPageletView({
        id: 'p1',
        domain: 'pdomain',
        displayName: 'p1',
        definitionQualifiedName: 'pfq',
        configurationParameters: {
          pkey4: '2',
        },
        slots: [
          {
            definitionQualifiedName: 'fq',
            displayName: 'slot',
          },
        ],
      });
    });

    it('should map ContentPageletView to SfeMetadata', () => {
      const sfeMetadata = SfeMapper.mapPageletViewToSfeMetadata(pagelet);

      expect(sfeMetadata).toMatchInlineSnapshot(`
        Object {
          "displayName": "p1",
          "displayType": "pfq",
          "id": "pagelet:pdomain:p1",
          "renderObject": Object {
            "domainId": "pdomain",
            "id": "p1",
            "type": "Pagelet",
          },
        }
      `);
    });

    it('should map ContentPageletEntryPointView to SfeMetadata', () => {
      const includeView = createContentPageletEntryPointView(include);
      const sfeMetadata = SfeMapper.mapIncludeViewToSfeMetadata(includeView);

      expect(sfeMetadata).toMatchInlineSnapshot(`
        Object {
          "displayName": "name",
          "displayType": "Include",
          "id": "include:idomain:include",
          "renderObject": Object {
            "domainId": "idomain",
            "id": "include",
            "type": "Include",
          },
        }
      `);
    });
  });
});
