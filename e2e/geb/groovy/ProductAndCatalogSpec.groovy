import pages.*

import testdata.TestDataLoader
import geb.spock.GebReportingSpec
import geb.*;
import geb.spock.*;
import spock.lang.*;
import static java.util.UUID.randomUUID


/**
 * Storefront tests for Product and Catalog Management at inSPIRED,
 * based on old Smoke Tests.
 * @author Sebastian Glass
 *
 */


@Timeout(600)
class ProductAndCatalogSpec extends GebReportingSpec {
      private static Map<String,List> testData;

    def setupSpec() {
        setup:
        testData = TestDataLoader.getTestData();
    }

    /**
     * Browse in Catalogs<p>
     *
     * Old Smoke Test:
     * testCatalogCategoryBrowsing(...)
     */
    def "Browse in Catalogs"() {

        when: "I go to the home page and click on a catalog..."
        to HomePage
        at HomePage
        selectCatalog(categoryTerm)

        then: "... now I'm at the Category-Page...."
        at CategoryPage
        withCategory(categoryTerm)

        when: "... and choose one."
        familyTiles(familyCode).click()

        then: "Now I can see all Products of this Subcategory."
        at FamilyPage
        productTiles(productName).size()>0

        where:
        categoryTerm  << testData.get("defaultProduct.browse.category")
        familyCode    << testData.get("defaultProduct.browse.family")
        productName   << testData.get("defaultProduct.browse.name")
    }

    /**
     * View Product Details<p>
     *      
     * Old Smoke Test:
     * testViewProductDetailsInSF(...)
     */
    @Ignore
    def "View Product Details"() {
        when: "I go to the home page and click on a catalog..."
        to HomePage
        at HomePage
        selectCatalog(categoryTerm)


        then: "... now I'm at the Category-Page...."
        at CategoryPage
        withCategory(categoryTerm)

        when: "... and choose one."
        familyTiles(familyCode).click()

        then: "Now I can see all Products of this Subcategory."
        at FamilyPage
        
        when: "I go through all Family Pages until I've found my Product."
        int iteration = 1
        while (iteration<=100 ) {
            println "Search on Family Page No. "+iteration
            if($("div",class:"product-list row").text().contains(productName))
                break;
            nextPage()
            at FamilyPage
            
            iteration++
            
            waitFor{$("li",class:"pagination-site-active").text().toInteger().equals(iteration)}
        }
        
        then: "Check for to many iterations"
        iteration<100
        
        when: "And then I click it..."
        productTiles(productName).click()

        then: "... to see details."
        at ProductDetailPage
        lookedForTitle productName

        where:
        categoryTerm  << testData.get("defaultProduct.browse.category")
        familyCode    << testData.get("defaultProduct.browse.family")
        productName   << testData.get("defaultProduct.browse.name")
    }


    /**
     * View Product Bundle<p>
     *
     * Old Smoke Test:
     * testViewProductBundle(...)
     */
    @Ignore
    def "View Product Bundle"() {

        when: "I go to the home page, search for product and..."
        to HomePage
        at HomePage
        header.search searchTerm

        then: "... have a choice, which I meant."
        at SearchResultPage

        when: "I choose the correct product and..."
        productTiles(productName).click()

        then: "... find it at the Detail Page."
        at ProductDetailPage
        lookedForSKU searchTerm
        isBundleWith sku1,sku2

        where:
        searchTerm  << testData.get("defaultProduct.bundle.sku")
        sku1        << testData.get("defaultProduct.bundle.subSku1")
        sku2        << testData.get("defaultProduct.bundle.subSku2")
        productName << testData.get("defaultProduct.bundle.name")
    }


    /**
     * View Product Retail Set<p>
     *
     * Old Smoke Test:
     * testViewRetailSet(...)
     */
     @Ignore
    def "View Product Retail Set"() {
        when: "I go to the home page, search for product and..."
        to HomePage
        at HomePage
        header.search searchTerm

        then: "... have a choice, which I meant."
        at SearchResultPage

        when: "I choose the correct product and..."
        productTiles(productName).click()


        then: "... find it at the Detail Page."
        at ProductDetailPage
        lookedForSKU searchTerm
        isBundleWith sku1,sku2
        isRetailSet()

        where:
        searchTerm  << testData.get("defaultProduct.retail.sku")
        sku1        << testData.get("defaultProduct.retail.subSku1")
        sku2        << testData.get("defaultProduct.retail.subSku2")
        productName << testData.get("defaultProduct.retail.name")
    }

    /**
     * View Variation Product<p>
     *
     * Old Smoke Test:
     * testViewVariationProduct(...)
     */
     @Ignore
    def "View Variation Product"() {
        when: "I go to the home page, search for product..."
        to HomePage
        at HomePage
        header.search searchTerm

        then: "... find it at the Detail Page."
        at ProductDetailPage
        lookedForSKU searchTerm
        title.contains(productName)
        isVariationable()


        where:
        searchTerm  << testData.get("defaultProduct.variation.sku")
        productName << testData.get("defaultProduct.variation.name")
    }


    /**
     * Display List of Products in Storefront<p>
     * 
     * Old Smoke Test:
     * testDisplayListOfProductsInSF(...)
     */
     @Ignore
    def "Display List of Products in Storefront"() {
        when: "I go to the home page, search nothing..."
        to HomePage
        at HomePage
        header.search ""

        then: "...and find nothing."
        at HomePage

        when: "Then I go to the home page, search everything..."
        to HomePage
        at HomePage
        header.search "*"

        then: "...and find everything."
        at SearchResultPage

        when: "I switch to listview..."
        listViewButton.click()

        then: "...there are 'Add to Cart'-Buttons..."
        at SearchResultPage
        waitFor{contentSlot.$('button', name: 'addProduct').size()>0}

        when: "...but in gridview..."
        gridViewButton.click()

        then: "...also Buttons."
        at SearchResultPage
        waitFor{contentSlot.$('button', name: 'addProduct').size()>0}
    }
    
     @Ignore
    def "Search after No Results found"(){
        
        when: "I go to the home page, search for a non existing product..."
        to HomePage
        at HomePage
        header.search "NothingToFindHere"
        
        then: "...and can't find anything."
        at NoSearchResultPage
        waitFor{contentSlot.$('input', name: 'SearchTerm').size()>0}
        
        when: "I will search with the Search box on 'No Results Found'..."
        contentSlot.$('input', name: 'SearchTerm').value   searchTerm
        contentSlot.$('button', name:'search').click()
        
        then: "... find it at the Detail Page."
        at ProductDetailPage
        lookedForSKU searchTerm
        title.contains(productName)
        isVariationable()        
        
        where:
        searchTerm  << testData.get("defaultProduct.variation.sku")
        productName << testData.get("defaultProduct.variation.name")
    }
    
    /**
     * Paging of Products with brand filter<p>
     *
     * Test for escalation:
     * IS-12332 Category Navigation: using paging disables SOLR brand filter
     */
    @Ignore
    def "Paging of Products with brand filter"() {

        when: "I go to the home page and click on a catalog..."
        to HomePage
        at HomePage
        selectCatalog(categoryTerm)


        then: "... now I'm at the Category-Page...."
        at CategoryPage
        withCategory(categoryTerm)

        when: "... and choose one."
        familyTiles(familyCode).click()

        then: "Now I can see all Products of this Subcategory."
        at FamilyPage
        
        when: "Click on next page link"
        nextPage()
        
        then: "I can see second page with products"
        at FamilyPage
        filterBar.find("li",class:contains("pagination-site-active"),text:iContains("2")).size() > 0
        
        when: "Click on a brand filter"
        selectFilterInNavigationBar(filter)
        
        then: "I can see results from applied brand filter"
        at FamilyPage
        checkSelectedFilterValue(filter)
        
        when: "Click on next page link"
        nextPage()
        
        then: "I can see second page with products and brand filter still selected"
        at FamilyPage
        checkSelectedFilterValue(filter)

        where:
        categoryTerm  << testData.get("defaultProduct.browse.category")
        familyCode    << testData.get("defaultProduct.browse.family")
        filter        << testData.get("defaultProduct.filter.name")
    }

    /**
     * display of a category specific filter, select the specific filter
     * and deselect the category with the category specific filter
     * results in deselection of the category specific filter.
     * IS-17708
     */
     @Ignore
    def "Select_Deselect Category Specific Filter"() {
        
        when: "I go to the home page and click on a category..."
        to HomePage
        at HomePage
        selectCatalog(catalogID)
        
        then: "category specific filter is not present"
        at CategoryPage
        navigationBar.find("h3", text:iContains(filterName)).size() == 0
        
        when: "I select a global filter at the category page"
        selectFilterInNavigationBar(globalFilterDisplayValue)
        
        then: "I got a family page with product results"
        at FamilyPage
        checkSelectedFilterValue(globalFilterDisplayValue)
        String totalCountMessage = getTotalCountMessage()
        totalCountMessage != null
        
        when: "I select the category with specific filter"
        at FamilyPage
        selectFilterInNavigationBar(categoryName)
        
        then: "the specific filter is present at that family page"
        at FamilyPage
        checkFilterExists(filterName)
        
        when: "Clicking on the category specific filter"
        selectFilterInNavigationBar(filterDisplayValue)
        
        then: "I see results with applied filter"
        at FamilyPage
        getTotalCountMessage() != totalCountMessage
        checkSelectedFilterValue(filterDisplayValue)

        when: "I deselect the category with the specific filter"
        deselectFilterInNavigationBar(categoryName)
        
        then: "the category specific filter is also deselected - result count is equal to before"
        getTotalCountMessage() == totalCountMessage
        
        where:
        catalogID                   << testData.get("filter.categorySpecific.catalogID")
        categoryID                  << testData.get("filter.categorySpecific.categoryID")
        categoryName                << testData.get("filter.categorySpecific.categoryName")
        globalFilterDisplayValue    << testData.get("filter.categorySpecific.globalFilterDisplayValue")
        filterName                  << testData.get("filter.categorySpecific.filterName")
        filterDisplayValue          << testData.get("filter.categorySpecific.filterDisplayValue")
    }
    
	@Override
	Browser createBrowser() {
		Browser browser = super.createBrowser()
		browser.registerPageChangeListener(new PageChangeReporter())
		return browser
	}
	
    /**
     * Compare Products<p>
     *
     * Old Smoke Test<br> testCompareProducts(...)
     * @return
     */
     @Ignore
    def "Compare Products"()
    {
        when: "I go to the home page and search "+searchTerm+"."
        to HomePage
        at HomePage
        header.search searchTerm

        then: "Now I'm at the Search Result Page..."
        at SearchResultPage

        when: "...with product."
        def productTile = productTiles(searchTerm)

        then: "There is a ExpressLink and..."
        productTile.expressShopContainerDiv.size()>0

        when: "...I click it..."
        productTile.clickExpressShop()

        then: "... see ExpressView..."
        at ExpressShopModal

        when: "... and add to compare."
        compareButton(sku).click()

        then:"Now there is 1 Product to compare with."
        at ComparePage

        when: "I search the second product..."
        header.search searchTerm2

        then: "...and find it at the Search Result Page!"
        at SearchResultPage

        when: "Mark it as correct..."
        productTile = productTiles(searchTerm2)

        then: "...find ExpressLink..."
        productTile.expressShopContainerDiv.size()>0

        when: "and click it..."
        productTile.clickExpressShop()

        then: "... see ExpresView..."
        at ExpressShopModal

        when: "... and add to Compare."
        compareButton(sku2).click()

        then:"Now there are 2 products to Compare."
        at ComparePage
        productField(searchTerm).size()>0
        productField(searchTerm2).size()>0

        where:
        searchTerm  = testData.get("defaultProduct.default.name")[0]
        sku         = testData.get("defaultProduct.default.sku")[0]
        searchTerm2 = testData.get("defaultProduct.default.name")[1]
        sku2        = testData.get("defaultProduct.default.sku")[1]

    }
}

class PageChangeReporter implements PageChangeListener {

    def uuid = randomUUID() as String
    def counter = 0

    void pageWillChange(Browser browser, Page oldPage, Page newPage) {
	def time =  new Date();
        println "[page changed] $uuid $time $oldPage $newPage ${browser.driver.currentUrl}"
        counter += 1
    }
}