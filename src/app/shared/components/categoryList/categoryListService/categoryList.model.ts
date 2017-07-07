export class CategoryListModel {
    Collapse: {
        nodes: [
            { 
                id: number,
                name: string,
                isExpanded : boolean,
                type: string,
                children : [
                    {
                        id: number, name: string,children?:{children},count?:number
                    }
                ]

            }
        ],
        Response: [
            {
                title: string;
                type: string;
                Data: [
                    { id: number, name: string, count: number }
                ]
            }
        ]
    }

}
