import { GroupData as GroupData } from './group.interface';
import { Group, GroupTree } from './group.model';

export class GroupHelper {
  static rootsFirst(a: GroupData, b: GroupData): number {
    if (a.relationships.parentGroup && !b.relationships.parentGroup) {
      return -1;
    }
    if (!a.relationships.parentGroup && b.relationships.parentGroup) {
      return 1;
    }
    if (!a.relationships.parentGroup && !b.relationships.parentGroup) {
      return 0;
    }
    if (a.relationships.parentGroup && b.relationships.parentGroup) {
      return 0;
    }
  }

  /**
   * Create a new empty tree with no groups.
   */
  static empty(): GroupTree {
    return {
      edges: {},
      groups: {},
      rootIds: [],
    };
  }

  static setParent(root: Group, childs: GroupTree): GroupTree {
    return {
      edges: { ...childs.edges, [root.id]: childs.rootIds },
      groups: { ...childs.groups, [root.id]: root },
      rootIds: [root.id],
    };
  }

  static merge(current: GroupTree, incoming: GroupTree): GroupTree {
    if (!current || !incoming) {
      throw new Error('falsy input');
    }

    return {
      edges: GroupHelper.mergeEdges(current.edges, incoming.edges),
      groups: GroupHelper.mergeGroups(current.groups, incoming.groups),
      rootIds: GroupHelper.mergeRootIDs(current.rootIds, incoming.rootIds),
    };
  }

  private static mergeRootIDs(current: string[], incoming: string[]): string[] {
    if (incoming && incoming.length > current.length) {
      return GroupHelper.removeDuplicates([...incoming, ...current]);
    } else {
      return GroupHelper.removeDuplicates([...current, ...incoming]);
    }
  }

  private static mergeGroups(
    current: { [id: string]: Group },
    incoming: { [id: string]: Group }
  ): { [id: string]: Group } {
    const groups = { ...current };
    Object.keys(incoming).forEach(key => {
      groups[key] = GroupHelper.mergeGroup(current[key], incoming[key]);
    });
    return groups;
  }

  static mergeGroup(old: Group, newGroup: Group): Group {
    if (!old) {
      return newGroup;
    }
    return {
      id: old.id ?? newGroup.id,
      name: old.name ?? newGroup.name,
      description: old.description ?? newGroup.description,
      organization: old.organization ?? newGroup.organization,
    };
  }

  private static mergeEdges(
    current: { [id: string]: string[] },
    incoming: { [id: string]: string[] }
  ): { [id: string]: string[] } {
    const edges = { ...current };
    Object.keys(incoming).forEach(key => {
      if (current[key]) {
        let high: string[];
        let low: string[];

        if (incoming[key] && incoming[key].length > current[key].length) {
          high = incoming[key];
          low = current[key];
        } else {
          high = current[key];
          low = incoming[key];
        }
        edges[key] = GroupHelper.removeDuplicates([...high, ...low]);
      } else {
        edges[key] = [...incoming[key]];
      }
    });
    return edges;
  }

  private static removeDuplicates<T>(input: T[]): T[] {
    return input.filter((value, index, array) => array.indexOf(value) === index);
  }
}
