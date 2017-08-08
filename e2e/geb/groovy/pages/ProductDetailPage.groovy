package pages

import pages.StorefrontPage

class ProductDetailPage extends StorefrontPage
{
    static at=
    {
        waitFor{$("div[data-testing-id='product-detail-page']").size()>0}
    }

    static content=
    {
        contentSlot      { $("div",role:"main") }
        pageTitle        { contentSlot.$("h1").text()}
		productInfoSection { contentSlot.$("div",class:"product-info") }
        productSKU       { productInfoSection.$("div",class:"product-number").$("span").text()}
        quantityInput    { $("input",id:iContains("quantity")) }
        addProductButton { productInfoSection.$("div",class:"add-to-cart").$("button") }

        bundleField      { $('div',class:iContains("bundled-product-list")) }
        promotionList    { $("ul",class:"promotion-list") }
        price            { productInfoSection.$('div',class:'current-price').text().
                           replaceAll(',','.').find(/\d+(\.\d+)?/) as BigDecimal }

    }

    //------------------------------------------------------------
    // Page checks
    //------------------------------------------------------------

    def lookedForTitle(searchTerm)
    {
        pageTitle.equalsIgnoreCase(searchTerm)
    }

    def lookedForSKU(searchTerm)
    {
        productSKU.contains(searchTerm)
    }

    def isBundleWith(id1,id2){
        bundleField.size()>0
        bundleField.$("div",class:"product-number",text:iContains(id1)).size()>0
        bundleField.$("div",class:"product-number",text:iContains(id2)).size()>0

    }

    def isRetailSet(){
        bundleField.$("input",type:"number").size()>0
    }

    def setProductQuantity(productsku, quantity){
        bundleField.$("input", type:"number", id:"Quantity_"+productsku).value quantity
    }


    def isVariationable(){
        waitFor{$('div',class:'product-variation-container').size()>0}
    }
    //------------------------------------------------------------
    // link functions
    //------------------------------------------------------------

    /**
     * add to cart and click view cart in the mini cart
     */
    def addToCart()
    {
        addProductButton.click()
    }

    /**
     * add to mini cart and wait for minicart display
     */
    def addToMiniCart()
    {
        addProductButton.click()
        waitFor { header.miniCart.displayed }
    }
}
