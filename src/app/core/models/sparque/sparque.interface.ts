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

export interface SparqueResponse {
  offset: number;
  count: number;
  type: string[];
  items: SparqueItems[];
}

export interface SparqueItems {
  rank: number;
  probability: number;
  tuple: SparqueTupel[];
}

export interface SparqueTupel {
  id: string;
  class: string[];
  attributes: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
