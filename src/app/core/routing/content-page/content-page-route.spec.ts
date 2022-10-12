import { TestBed } from '@angular/core/testing';
import { Router, UrlMatchResult, UrlSegment } from '@angular/router';

import { createContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

import { generateContentPageUrl, matchContentRoute } from './content-page.route';

describe('Content Page Route', () => {
  const topElement: ContentPageTreeElement = { contentPageId: 'top', name: 'top layer', path: ['top'] };
  const secondElement: ContentPageTreeElement = {
    contentPageId: 'second',
    name: 'second layer',
    path: ['top', 'second'],
  };
  const bottomElement: ContentPageTreeElement = {
    contentPageId: 'bottom',
    name: 'bottom layer',
    path: ['top', 'second', 'bottom'],
  };

  expect.addSnapshotSerializer({
    test: val => val?.consumed && val.posParams,
    print: (val: UrlMatchResult, serialize) =>
      serialize(
        Object.keys(val.posParams)
          .map(key => ({ [key]: val.posParams[key].path }))
          .reduce((acc, v) => ({ ...acc, ...v }), {})
      ),
  });

  let wrap: (url: string) => UrlSegment[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const router = TestBed.inject(Router);
    wrap = url => {
      const primary = router.parseUrl(url).root.children.primary;
      return primary ? primary.segments : [];
    };
  });

  describe('without anything', () => {
    it('should be created', () => {
      expect(generateContentPageUrl(undefined)).toMatchInlineSnapshot(`"/"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchContentRoute(wrap(generateContentPageUrl(undefined)))).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('with top level content page without name', () => {
    const topLevelView = createContentPageTreeView(
      ContentPageTreeHelper.single({ ...topElement, name: undefined }),
      'top',
      'top'
    );

    it('should be created', () => {
      expect(generateContentPageUrl(topLevelView)).toMatchInlineSnapshot(`"/pgtop"`);
    });

    it('should be a match for matcher', () => {
      expect(matchContentRoute(wrap(generateContentPageUrl(topLevelView)))).toMatchInlineSnapshot(`
        Object {
          "contentPageId": "top",
        }
      `);
    });
  });

  describe('with top level content page', () => {
    const topLevelView = createContentPageTreeView(ContentPageTreeHelper.single(topElement), 'top', 'top');

    it('should be created', () => {
      expect(generateContentPageUrl(topLevelView)).toMatchInlineSnapshot(`"/top-layer-pgtop"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchContentRoute(wrap(generateContentPageUrl(topLevelView)))).toMatchInlineSnapshot(`
        Object {
          "contentPageId": "top",
        }
      `);
    });
  });

  describe('with deep content page hierachy', () => {
    const topLevelTree = ContentPageTreeHelper.single(topElement);
    const secondLevelTree = ContentPageTreeHelper.add(topLevelTree, secondElement);
    const completeTree = ContentPageTreeHelper.add(secondLevelTree, bottomElement);

    const bottomLevelView = createContentPageTreeView(completeTree, 'bottom', 'bottom');

    it('should be created', () => {
      expect(generateContentPageUrl(bottomLevelView)).toMatchInlineSnapshot(
        `"/top-layer/second-layer/bottom-layer-pgbottom"`
      );
    });

    it('should not be a match for matcher', () => {
      expect(matchContentRoute(wrap(generateContentPageUrl(bottomLevelView)))).toMatchInlineSnapshot(`
        Object {
          "contentPageId": "bottom",
        }
      `);
    });
  });
});
