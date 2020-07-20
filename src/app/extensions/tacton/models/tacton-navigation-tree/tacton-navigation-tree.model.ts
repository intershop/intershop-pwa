export type TactonNavigationTree = {
  name: string;
  description: string;
  children?: TactonNavigationTree;
}[];
