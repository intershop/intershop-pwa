import { OrganizationGroup } from './organization-group.model';

export class OrganizationGroupHelper {
  /**
   * This recursive method resolves all parameter which are necessary to use OrganizationGroup model as cdk flat tree data object.
   * The data array will sorted by the tree level and the alphanumeric order of each organization group display name.
   * Furthermore, the tree level parameter is added to each data object.
   *
   * @param data OrganizationGroup array.
   * @param index index of the current object.
   * @param sortedArray new sorted OrganizationGroup array, has default value as start value.
   * @param level tree depth of the current object, has default value as start value.
   *
   * @returns the new sorted OrganizationGroup array.
   */
  static resolveTreeAttributes(
    data: OrganizationGroup[],
    index: number,
    sortedArray: OrganizationGroup[] = [],
    level: number = 0
  ): OrganizationGroup[] {
    let currentIndex = index;
    if (currentIndex === undefined) {
      currentIndex = data.findIndex(e => !e.parentId);
      sortedArray.push(data[currentIndex]);
    }
    data[currentIndex].level = level;
    const children = data[currentIndex].childrenIds;
    if (children) {
      const sortedChildArray = data
        .filter(element => children.includes(element.id))
        .sort((a, b) => (a.displayName > b.displayName ? 1 : b.displayName > a.displayName ? -1 : 0));

      sortedChildArray.forEach(child => {
        sortedArray.push(child);
        OrganizationGroupHelper.resolveTreeAttributes(
          data,
          data.findIndex(e => e.id === child.id),
          sortedArray,
          level + 1
        );
      });
    }

    return sortedArray;
  }
}
