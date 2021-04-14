import { Injectable } from '@angular/core';

import { ContentPageletTreeHelper } from './content-pagelet-tree.helper';
import { ContentPageletTreeData, ContentPageletTreeLink } from './content-pagelet-tree.interface';
import { ContentPageletTree, ContentPageletTreeElement } from './content-pagelet-tree.model';

@Injectable({ providedIn: 'root' })
export class ContentPageletTreeMapper {
  /**
   * Check type of elements
   */
  private areElementsContentPageletTrees(
    elements: ContentPageletTreeData[] | ContentPageletTreeLink[]
  ): elements is ContentPageletTreeData[] {
    return (elements as ContentPageletTreeData[])[0].type === 'PageTreeRO';
  }

  convertLinkToTreeData(tree: ContentPageletTreeData, element: ContentPageletTreeLink): ContentPageletTreeData {
    return {
      page: element,
      name: undefined,
      link: undefined,
      type: 'PageTreeRO',
      path: tree.path ? [...tree.path, element] : [tree.page, element], // add element to path if exists or create a new one
    };
  }

  /**
   * Utility Method:
   * Maps the incoming raw page tree path to a path with unique IDs.
   */
  mapContentPageTreeElementPath(path: ContentPageletTreeLink[]) {
    if (path && path.length) {
      return path.map(x => x.itemId).reduce((acc, _, idx, arr) => [...acc, arr.slice(0, idx + 1).join('.')], []);
    }
    throw new Error('input is falsy');
  }

  /**
   * Utility Method:
   * Creates page tree stubs from the page tree path
   */
  treeElementsFromTreeElementPath(path: ContentPageletTreeLink[]): ContentPageletTree {
    if (!path || !path.length) {
      return ContentPageletTreeHelper.empty();
    }

    let uniqueId: string;
    const newTreeElementPath: string[] = [];

    return (
      path
        .map(pathElement => {
          // accumulate and construct uniqueId and page tree path
          uniqueId = !uniqueId ? pathElement.itemId : `${uniqueId}.${pathElement.itemId}`;
          newTreeElementPath.push(uniqueId);

          // yield page tree element
          return {
            uniqueId,
            name: pathElement.title,
            path: [...newTreeElementPath],
            contentPageId: pathElement.itemId,
          };
        })
        // construct a tree from it
        .reduce(
          (tree, element: ContentPageletTreeElement) => ContentPageletTreeHelper.add(tree, element),
          ContentPageletTreeHelper.empty()
        )
    );
  }

  /**
   * Maps a raw {@link ContentPageletTreeData } element to a {@link ContentPageletTreeElement} element ignoring sub elements.
   */
  fromDataSingle(treeData: ContentPageletTreeData): ContentPageletTreeElement {
    if (treeData) {
      const treePath = this.mapContentPageTreeElementPath(treeData.path);
      const uniqueId = treePath[treePath.length - 1];
      return {
        uniqueId,
        contentPageId: treeData.page.itemId,
        path: treePath,
        name: treeData.page.title,
      };
    } else {
      throw new Error(`'treeData' is required`);
    }
  }

  /**
   * Converts the tree of {@link ContentPageletTreeData} to the model entity {@link ContentPageletTree}.
   * Inserts all sub categories accordingly.
   */
  fromData(treeData: ContentPageletTreeData): ContentPageletTree {
    if (treeData) {
      // recurse into tree
      let subTrees: ContentPageletTree;

      // add page tree element to path, if it does not exists in current path
      if (treeData.parent && treeData.path?.filter(e => e === treeData.page).length === 0) {
        treeData.path = [...treeData.path, treeData.page];
      }
      if (treeData.elements && treeData.elements.length) {
        /**
         * check type of available elements: {@link ContentPageletTreeData} or {@link ContentPageTreeLink}.
         */
        if (this.areElementsContentPageletTrees(treeData.elements)) {
          subTrees = treeData.elements
            .map(c => {
              c.path = [...c.path, c.page];
              return this.fromData(c) as ContentPageletTree;
            })
            .reduce((a, b) => ContentPageletTreeHelper.merge(a, b));
        } else {
          subTrees = treeData.elements
            .map(c => this.fromData(this.convertLinkToTreeData(treeData, c)) as ContentPageletTree)
            .reduce((a, b) => ContentPageletTreeHelper.merge(a, b));
        }
      } else {
        subTrees = ContentPageletTreeHelper.empty();
      }

      if (!treeData.path) {
        treeData.path = [treeData.page];
      }

      // create tree from current tree
      const rootPagelet = this.fromDataSingle(treeData);

      const tree = ContentPageletTreeHelper.single(rootPagelet);

      // create tree from current tree path stubs
      const categoryPathTree = this.treeElementsFromTreeElementPath(treeData.path);

      // merge sub elements onto current tree
      const treeWithSubElements = ContentPageletTreeHelper.merge(tree, subTrees);

      // merge current tree path stubs onto current tree
      return ContentPageletTreeHelper.merge(treeWithSubElements, categoryPathTree);
    } else {
      throw new Error(`'treeData' is required`);
    }
  }
}
