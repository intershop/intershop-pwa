export type TactonNavigationTree = {
  name: string;
  description: string;
  hasVisibleParameters?: boolean;
  active?: boolean;
  children?: TactonNavigationTree;
}[];
