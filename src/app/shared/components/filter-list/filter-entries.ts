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
    link: Link;
    hits: Hits;
    selected: boolean;
    level?: boolean;
}

export class Element {
    name: string;
    type: string;
    id: string;
    facets: Facet[];
    displayType: string;
    selectionType: string;
    limitCount: number;
    minCount: number;
    scope: string;
}

export class FilterListModel {
    elements: Element[];
    type: string;
    name: string;
}

