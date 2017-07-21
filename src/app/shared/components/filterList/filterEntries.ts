
// export class FilterEntries {
//     filterEntries : Array<FilterEntry>;
//     type: string;
//     name: string;

//      constructor(values: Object = {}) {
//         Object.assign(this, values);
//     }
// }


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
    level: number = 0;
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