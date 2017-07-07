import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CategoryService } from "app/shared/components/categoryList/categoryListService/categoryList.service";
import { DataEmitterService ,CacheCustomService} from "app/shared/services";

@Component({
    selector: 'is-filterlist',
    templateUrl: './categoryList.component.html',
    styles: ['.img { border:2px solid; border-radius:50px}',
    '.mrgn-bt-5 {margin : 0 5px 0 0 }']
})

export class CategoryListComponent implements OnInit {
    Collapse: any;
    brandFilter: any[] = [];
    categoryFilter;
    priceFilter;
    colorFilter;
    selectedColor;
    allFilters: any = {
        price: {},
        brand: [],
        color: {},
        category: {}
    };
    class;
    filterkey = 'filterData';
    constructor(private deciderService: CategoryService, private customService: CacheCustomService, private dataEmitterService: DataEmitterService) {
    }

     ngOnInit() {
           if (this.customService.CacheKeyExists(this.filterkey)) {
                this.Collapse = this.customService.GetCachedData(this.filterkey);
           }else {
              this.deciderService.deciderFunction().getSideFilters().subscribe(data=>{
                this.Collapse = data;
               });
               this.customService.StoreDataToCache(this.Collapse, this.filterkey,true);
           }
     }

    filterCategory(category) {
        this.categoryFilter = category;
        this.allFilter('category', this.categoryFilter);
    }

    filterBrand(brandsSelected) {
        if (brandsSelected.checked) {
            brandsSelected.checked = false;
        }
        if (this.brandFilter.length === 0) {
            this.brandFilter.push(brandsSelected);

        } else {
            const itemExists = this.brandFilter.filter((item) => item.id === brandsSelected.id);
            if (itemExists.length > 0) {
                this.brandFilter = this.brandFilter.filter((item) => item.id !== brandsSelected.id);
            } else {
                this.brandFilter.push(brandsSelected);
            }
        }
        this.allFilter('brand', this.brandFilter);
    }

    filterPrice(allPrices, selectedPrice) {
        if (allPrices) {
            allPrices.forEach(element => {
                element.showImage = false;
            });
            selectedPrice.showImage = true;
            this.priceFilter = selectedPrice;
            this.allFilter('price', this.priceFilter);
        } else {
            this.priceFilter = {};
            this.allFilter('price', this.priceFilter);
        }
    };

    filterColor(color, index) {
        this.selectedColor = index;
        if (this.colorFilter && this.colorFilter.name === color.name) {
            this.colorFilter = {}
            this.selectedColor = null;
        } else {
            this.colorFilter = color;
        }
        this.allFilter('color', this.colorFilter);
    }

    allFilter(name, value) {
        this.allFilters[name] = value;
        this.dataEmitterService.pushData(this.allFilters);
    }
}
