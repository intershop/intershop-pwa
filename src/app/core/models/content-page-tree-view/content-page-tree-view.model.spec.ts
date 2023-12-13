import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';

import { createContentPageTreeView } from './content-page-tree-view.model';

describe('Content Page Tree View Model', () => {
  it('should not loop forever with recursive tree', () => {
    const rootElement = { contentPageId: 'A', path: ['A'] } as ContentPageTreeElement;
    const child1 = { contentPageId: 'A.1', path: ['A', 'A.1'] } as ContentPageTreeElement;
    const child2 = { contentPageId: 'A.2', path: ['A', 'A.2'] } as ContentPageTreeElement;
    const loopingChild = { contentPageId: 'A.1', path: ['A', 'A.1', 'A.1'] } as ContentPageTreeElement;

    const empty = ContentPageTreeHelper.empty();
    const tree0 = ContentPageTreeHelper.add(empty, rootElement);
    const tree1 = ContentPageTreeHelper.add(tree0, child1);
    const tree2 = ContentPageTreeHelper.add(tree1, child2);
    const loopingTree = ContentPageTreeHelper.add(tree2, loopingChild);

    createContentPageTreeView(loopingTree, 'A', 'A');
  });
});
