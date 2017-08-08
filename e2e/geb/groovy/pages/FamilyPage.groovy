package pages

import pages.StorefrontPage
import pages.modules.ProductTile

class FamilyPage extends StorefrontPage
{
    static at =
    {
        waitFor{productList.size()>0}
    }

    static content =
    {

        contentSlot { $('[data-testing-id^="family-page"]') }
//    contentSlot   { $("div[data-testing-id]") }
        navigationBar { contentSlot.find("div",class:"filter-panel") }
        filterBar     { contentSlot.$("div",class:contains("filters-row")) }
        productList   { contentSlot.$("div",class:"product-list row") }
        productTiles  { term -> module(new ProductTile(productTerm: term)) }
		currentPageNumber { contentSlot.$("li", class:"pagination-site-active") }
        richContent   { contentSlot.$('[data-testing-id="category-rich-content"]') }
    }
    
    public boolean showsProduct(productName)
    {
    
        return productList.text().contains(productName)
    }
    
    public void nextPage()
    {
        $("a",title:"to next page").click()
    }

    /**
     * clicks on a filter with the specified value. The value must be unique across all
     * filter values in the navigation bar.    
     */
    def selectFilterInNavigationBar(filterValue)
    {
        navigationBar.$("li",class:contains("filter-item"),text:iContains(filterValue)).find("a").click()
    }
    
    /**
     * de-select a filter value with clicking on the filter-clear link (displayType: filter_clear) 
     */
    def deselectFilterInNavigationBar(filterValue)
    {
        navigationBar.find("li", class:contains("filter-selected"), text:iContains(filterValue)).find("a", class:contains("filter-clear")).click()
    }
    
    /**
     * checks if there is a filter-item selected with the given filter value 
     */
    def checkSelectedFilterValue(filterValue)
    {
        navigationBar.find("li",class:contains("filter-selected"),text:iContains(filterValue)).size() > 0
    }
    
    /**
     * check presence of a filter heading with the given name 
     */
    def checkFilterExists(filterName)
    {
        navigationBar.find("h3", text:iContains(filterName)).size() > 0
    }
    
    
    /**
     * gets the message in pagination bar e.g. "59 list items"  
     */
    def getTotalCountMessage()
    {
        return filterBar.find("div", class:contains("pagination-total")).text()
    }
    
    public String richContent()
    {
        return contentSlot.$('[data-testing-id="category-rich-content"]')
    }
}
