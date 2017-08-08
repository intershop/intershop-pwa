package pages

import pages.modules.ProductTile
import pages.StorefrontPage;

import geb.Page

class SearchResultPage extends StorefrontPage
{
    static at =
    {
        waitFor{contentSlot.size()>0}
    }

    static content =
    {
        contentSlot    { $("div[data-testing-id='search-result-page']") }
        navigationBar  { contentSlot.$("div",class:"ish-pageNavigation-contents") }
        productTiles   { term -> module(new ProductTile(productTerm: term)) }
        listViewButton { $("a[data-testing-id='list-view-link']") }
        gridViewButton { $("a[data-testing-id='grid-view-link']") }
    }
}
