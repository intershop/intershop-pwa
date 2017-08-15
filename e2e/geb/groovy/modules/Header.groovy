package modules

import geb.Module

class Header extends Module
{
    static content =
    {
        searchForm   { $('form', name:'SearchBox_Header') }
        miniCartLink { $('a', href:'#miniCart') }
        miniCart { $('div', id:'miniCart') }  
    }

    def search(searchTerm)
    {
        searchForm.$('input', type:'text').value   searchTerm
        searchForm.$('button', name:'search').click()
    }
    
    def showMiniCart()
    {
        if(miniCartLink.$(''))
        {
            miniCartLink.click();
        }
    }
    
    def viewCartMiniCart()
    {
        waitFor { miniCart.$('a', class:'view-cart').displayed }
        miniCart.$('a', class:'view-cart').click()
    }    
}
