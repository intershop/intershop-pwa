import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { ICategoryService } from "app/shared/components/categoryList/categoryListService/iCategoryList.service";

@Injectable()
export class CategoryMockService implements ICategoryService {

    Collapse = {
        Response: [
            {
                type: 'none',
                title: 'Category',
                Data: [
                    { id: 1, name: 'Cameras', count: 4 },
                    // { id: 2, name: 'Category2', count: 32 },
                    // { id: 3, name: 'Category3', count: 32 },
                    // { id: 4, name: 'Category4', count: 32 },
                ]
            },

            // {
            //    id: 1,
            //    name: 'Category',
            //    isExpanded: true,
            //    type:'none',
            //    children: [
            //        { id: 2, name: 'Category1', count: 32 },
            //        { id: 3, name: 'Category2' },
            //        { id: 4, name: 'Category3' },
            //        {
            //            id: 5, name: 'Category4',
            //            children: [
            //                { id: 6, name: 'SubCategory1' },
            //                { id: 7, name: 'SubCategory2' },
            //            ]
            //        }
            //    ]

            // },
            {
                type: 'checkBox',
                title: 'Brand',
                Data: [
                    { id: 1, name: 'Dicota', count: 2 },
                    { id: 5, name: 'Fujifilm', count: 1 },
                    { id: 3, name: 'Sony', count: 1 },
                ]
            },
            {
                type: 'Radiobutton',
                title: 'Price',
                Data: [
                    { id: 1, name: '<= $ 10 ', min: 0, max: 10 },
                    { id: 5, name: '$ 25 - $ 50', min: 25, max: 50 }
                ]
            },
            {
                type: 'color',
                title: 'Color',
                Data: [
                    { id: 1, name: 'red', imgsrc: '../../assets/colors/pink.png', color: 'red' },
                    { id: 2, name: 'green', imgsrc: '../../assets/colors/blue.png',color: 'green' },
                    { id: 3, name: 'silver', imgsrc: '../../assets/colors/blue.png',color: 'silver' },
                    { id: 5, name: 'yellow', imgsrc: '../../assets/colors/yellow.png',color: 'silver' }
                ]
            },

        ]
    };


    getSideFilters(): Observable<any> {
        return Observable.of(this.Collapse);
    }

}





