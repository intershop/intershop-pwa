export class Link {
    type: string;
    uri: string;
    title: string;
}

export class Hits {
    type: string;
    uri: string;
    title: string;
}

export class Facet {
    name: string;
    type: string;
    count: number;
    level = 0;
    link: Link;
    hits: Hits;
    selected: boolean;
}

export class FilterEntry {
    name: string;
    type: string;
    id: string;
    displayType: string;
    selectionType: string;
    limitCount: number;
    minCount: number;
    scope: string;
    facets: Facet[];
}

export class FilterListData {
    filterEntries: FilterEntry[];
    type: string;
    name: string;
}
