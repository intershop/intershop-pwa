package pages.modules

import geb.Module

class OrderAddressSummary extends Module
{   
    static content = 
    {
        addressSummary { $("div", class:"address-summary") }
        
        invoiceTo { addressSummary.$("div[data-testing-id='address-summary-invoice-to-address']") }
        shipTo { addressSummary.$("div[data-testing-id='address-summary-ship-to-address']") }
    }
 
    def boolean isInvoiceToAddress(fName,lName,address,city,postal)
    {
        return  (invoiceTo.text().contains(fName) &&
        invoiceTo.text().contains(lName) &&
        invoiceTo.text().contains(address) &&
        invoiceTo.text().contains(city) &&
        invoiceTo.text().contains(postal))
    }
    
    def boolean isShipToAddress(param)
    {
        return shipTo.text().contains(param)
    }
    
    def boolean isShipToAddress(fName,lName,address,city,postal)
    {
        return (shipTo.text().contains(fName) &&
        shipTo.text().contains(lName) &&
        shipTo.text().contains(address) &&
        shipTo.text().contains(city) &&
        shipTo.text().contains(postal))
    }
}
