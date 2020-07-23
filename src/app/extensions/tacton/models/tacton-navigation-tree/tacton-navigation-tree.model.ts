export type TactonNavigationTree = {
  name: string;
  description: string;
  active: boolean;
  children?: TactonNavigationTree;
}[];
