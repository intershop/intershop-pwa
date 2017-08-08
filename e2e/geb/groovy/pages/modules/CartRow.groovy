package pages.modules

import geb.Module;
import geb.navigator.Navigator;

class CartRow extends Module
{
    def productTerm;
    
    static content = {
        quantityInput(required: false) { $('input[data-testing-id="product-count-'+productTerm+'-element"]') }
        removeLink(required: false) { $('a[href*="removeProduct"]') }
    }
    
    Navigator click(){
        panel.click()
    }
}
