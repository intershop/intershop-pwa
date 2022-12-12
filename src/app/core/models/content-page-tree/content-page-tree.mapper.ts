import { Injectable } from '@angular/core';

import { Link } from 'ish-core/models/link/link.model';

import { ContentPageTreeHelper } from './content-page-tree.helper';
import { ContentPageTreeData } from './content-page-tree.interface';
import { ContentPageTree, ContentPageTreeElement } from './content-page-tree.model';

@Injectable({ providedIn: 'root' })
export class ContentPageTreeMapper {
  /**
   * Check type of elements
   */
  private areElementsContentPageTreeData(elements: ContentPageTreeData[] | Link[]): elements is ContentPageTreeData[] {
    return (elements as ContentPageTreeData[])[0].type === 'PageTreeRO';
  }

  /**
   *
   * @param tree parent page tree
   * @param element page tree link
   * @returns converted page tree
   */
  convertLinkToTreeData(tree: ContentPageTreeData, element: Link): ContentPageTreeData {
    return {
      page: element,
      type: 'PageTreeRO',
      path: tree.path ? [...tree.path, element] : [tree.page, element], // add element to path if exists or create a new one
    };
  }

  /**
   * Utility Method:
   * Maps the incoming raw page tree path to a path with unique IDs.
   */
  mapContentPageTreeElementPath(path: Link[]) {
    if (path?.length) {
      return path.map(x => x?.itemId);
    }
    throw new Error('input is falsy');
  }

  /**
   * Utility Method:
   * Creates page tree stubs from the page tree path
   */
  treeElementsFromTreeElementPath(path: Link[]): ContentPageTree {
    if (!path?.length) {
      return ContentPageTreeHelper.empty();
    }

    const newTreeElementPath: string[] = [];

    return (
      path
        .map(pathElement => {
          newTreeElementPath.push(pathElement.itemId);

          // yield page tree element
          return {
            name: pathElement.title,
            path: [...newTreeElementPath],
            contentPageId: pathElement.itemId,
          };
        })
        // construct a tree from it
        .reduce(
          (tree, element: ContentPageTreeElement) => ContentPageTreeHelper.add(tree, element),
          ContentPageTreeHelper.empty()
        )
    );
  }

  /**
   * Maps a raw {@link ContentPageTreeData } element to a {@link ContentPageTreeElement} element ignoring sub elements.
   */
  fromDataSingle(treeData: ContentPageTreeData): ContentPageTreeElement {
    if (treeData) {
      const treePath = this.mapContentPageTreeElementPath(treeData.path);
      return {
        contentPageId: treeData.page?.itemId,
        path: treePath,
        name: treeData.page?.title,
      };
    } else {
      throw new Error(`'treeData' is required`);
    }
  }

  /**
   * Converts the tree of {@link ContentPageTreeData} to the model entity {@link ContentPageTree}.
   * Inserts all sub categories accordingly.
   */
  fromData(treeData: ContentPageTreeData): ContentPageTree {
    if (treeData) {
      // recurse into tree
      let subTrees: ContentPageTree;

      // add page tree element to path, if it does not exists in current path
      if (treeData.parent && treeData.path?.filter(e => e === treeData.page).length === 0) {
        treeData.path = [...treeData.path, treeData.page];
      }

      if (treeData.elements?.length) {
        /**
         * check type of available elements: {@link ContentPageTreeData} or {@link Link}.
         */
        if (this.areElementsContentPageTreeData(treeData.elements)) {
          subTrees = treeData.elements
            .map(c => {
              c.path = [...c.path, c.page];
              return this.fromData(c) as ContentPageTree;
            })
            .reduce((a, b) => ContentPageTreeHelper.merge(a, b));
        } else {
          subTrees = treeData.elements
            .map(c => this.fromData(this.convertLinkToTreeData(treeData, c)) as ContentPageTree)
            .reduce((a, b) => ContentPageTreeHelper.merge(a, b));
        }
      } else {
        subTrees = ContentPageTreeHelper.empty();
      }

      if (!treeData.path) {
        treeData.path = [treeData.page];
      }

      // create tree from current tree
      const rootPage = this.fromDataSingle(treeData);

      const tree = ContentPageTreeHelper.single(rootPage);

      // create tree from current tree path stubs
      const elementPathTree = this.treeElementsFromTreeElementPath(treeData.path);

      // merge sub elements onto current tree
      const treeWithSubElements = ContentPageTreeHelper.merge(tree, subTrees);

      // merge current tree path stubs onto current tree
      return ContentPageTreeHelper.merge(treeWithSubElements, elementPathTree);
    } else {
      throw new Error(`'treeData' is required`);
    }
  }
}
