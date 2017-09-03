package modules

import geb.Module
import geb.navigator.Navigator

class ProductTile extends Module
{
    def productTerm;
    
    static content = {
        expressShopContainerDiv { 
            $("div",class:"product-tile",text:iContains(productTerm)).
            find("div" ,class: "product-image-container") }
        expressShopTriggerDiv { expressShopContainerDiv.find("div" ,class: "express-shop-trigger") }
        title { $("a",class:"product-title",text:iContains(productTerm)) }
    }
    
    def clickExpressShop()
    {
        interact
        {
            moveToElement( expressShopContainerDiv)
            expressShopTriggerDiv.jquery.show()
            expressShopTriggerDiv.click()
        }
    }
    
    Navigator click(){
        title.first().click()
    }
}
