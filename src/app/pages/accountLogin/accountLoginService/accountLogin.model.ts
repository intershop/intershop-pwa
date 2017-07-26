    class PreferredInvoiceToAddress {
        type: string;
        urn: string;
        id: string;
        addressName: string;
        title: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        phoneHome: string;
        country: string;
        countryCode: string;
        city: string;
        usage: boolean[];
        invoiceToAddress: boolean;
        shipFromAddress: boolean;
        serviceToAddress: boolean;
        installToAddress: boolean;
        shipToAddress: boolean;
        street: string;
    }

    class PreferredShipToAddress {
        type: string;
        urn: string;
        id: string;
        addressName: string;
        title: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        phoneHome: string;
        country: string;
        countryCode: string;
        city: string;
        usage: boolean[];
        invoiceToAddress: boolean;
        shipFromAddress: boolean;
        serviceToAddress: boolean;
        installToAddress: boolean;
        shipToAddress: boolean;
        street: string;
    }

    export class UserDetail {
        type: string;
        customerNo: string;
        preferredInvoiceToAddress: PreferredInvoiceToAddress;
        preferredShipToAddress: PreferredShipToAddress;
        title: string;
        firstName: string;
        lastName: string;
        phoneHome: string;
        phoneBusiness: string;
        phoneMobile: string;
        fax: string;
        email: string;
        hasRole: boolean
    }


