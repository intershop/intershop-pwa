export interface SparqueOptionsResponse {
  id: string;
  title: string;
  selected: string[];
  options: {
    id: string;
    score: number;
    value: string;
    title: string;
  }[];
}

export interface SparqueCountResponse {
  total: number;
  stats: {
    cutoff: string;
    numResults: number;
  }[];
}

export interface SparqueFacetResponse {
  offset: number;
  count: number;
  type: string[];
  items: SparqueFacetItem[];
}

interface SparqueFacetItem {
  rank: number;
  probability: number;
  tuple: {
    id: string;
    class: string[];
    attributes: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  }[];
}

export interface SparqueFacetOptionsResponse {
  offset: number;
  count: number;
  type: string[];
  items: {
    rank: number;
    probability: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tuple: any[];
  }[];
}
