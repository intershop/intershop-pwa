package pages.modules

import geb.Module

class OrderSummaryRow extends Module
{
    //e.g. VAT incl. in Order Total
    String fieldName
    
    static content = {
        orderLine { $("div", class:"cost-summary").find("dt",text:fieldName) }
    }
}
