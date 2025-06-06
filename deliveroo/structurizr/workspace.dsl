workspace "Deliveroo Logistics System" "A C4 model of a logistics system" {

    model {
        customer = person "Customer" "A client who requests transport of goods from one location to another"
        staff = person "Internal Staff" "Operational or Management staff member"
        # dispatcher = person "Dispatcher" "Staff member responsible for planning routes and assigning resources"
        # driver = person "Driver" "Employee who transports goods between locations"
        # warehouse_staff = person "Warehouse Staff" "Person responsible for handling goods in the warehouse"
        # logistics_specialist = person "Logistics Specialist" "Staff member overseeing logistics processes and resolving issues"
        # fleet_manager = person "Fleet Manager" "Staff member managing vehicle availability and maintenance"
        # recipient = person "Recipient" "Person or entity receiving the delivered goods"
        external_partner = person "External Partner" "Third-party provider such as an external warehouse or subcontracted carrier"

        paymentProvider = softwareSystem "Payment Provider" "Handles payment processing" {
            tag "external"
        }

        invoicingSystem = softwareSystem "Invoicing System" "Handles invoicing" {
            tag "external"
        }

        deliverooWMS = softwareSystem "Deliveroo Warehouse Management System" "Allows warehouse staff to manage inventory, cargo and warehouse availability" {

            !adrs wms/adrs
            !docs wms/docs/overview.md

            WMS-DB = container "WMS-DB" "Stores product catalog, orders, etc." "PostgreSQL" {
                tag "database"
            }

            WMS-API = container "Warehouse Management System API" "Provides warehousing via API" "Python" {
                WMSCapacity = component "WMS Capacity Component" "Determines the capacity of the warehouse"
                WMSAvailability = component "WMS Availability Component" "Determines the availability of the warehouse"
                WMSStorageManagement = component "WMS Storage Management Component" "Manages the storage of goods in the warehouse"

                WMSCapacity -> WMS-DB "R/W"
                WMSAvailability -> WMS-DB "R/W"
                WMSStorageManagement -> WMS-DB "R/W"

                WMSStorageManagement -> invoicingSystem "Processes invoicing via"
                WMSStorageManagement -> paymentProvider "Processes payments via"
            }

            webWMSApp = container "Web Application" "Provides warehouse management to customers and staff" "Angular SPA" {
                tag "webApp"
                webWMSApp -> WMS-API "customer and staff operations"
            }

            mobileWMSApp = container "Mobile WMS Application" "Allows warehouse staff to manage inventory, cargo and warehouse availability" "React Native" {
                tag "mobileApp"
                mobileWMSApp -> WMS-API "staff operations"
            }
        }

        deliverooTMS = softwareSystem "Deliveroo Transport Management System" "Allows customers to browse and purchase products online" {

            !adrs tms/adrs
            !docs tms/docs/overview.md

            webTMSApp = container "TMS Web Application" "Provides e-commerce functionality to customers" "React SPA" {
                tag "webApp"
            }
            
            TMS-DB = container "TMS-DB" "Stores product catalog, orders, etc." "PostgreSQL" {
                tag "database"
            }

            TMS-API = container "Transport API" "Provides transport via API" "Node.js" {
                transportComponent = component "Transport Component" "Manages transport operations"

                transportComponent -> TMS-DB "R/W"
                transportComponent -> invoicingSystem "Processes invoicing via"
                transportComponent -> paymentProvider "Processes payments via"
            }

            webTMSApp -> TMS-API "Makes API calls to" "JSON/HTTPS"
            TMS-API -> TMS-DB "Reads from and writes to"
            TMS-API -> WMS-API "Reads warehousing"

            webCustomerRequestPortal = container "Customer Request Portal" "Provides a portal for customers to request transport of goods" "Nuxt app" {
                tag "webApp"
            }
            webCustomerRequestPortal -> TMS-API "Makes API calls to" "JSON/HTTPS"
        }

        customer -> webCustomerRequestPortal "Requests and tracks transport of goods using"
        staff -> deliverooWMS "Manages warehousing operations"
        staff -> deliverooTMS "Manages transport operations"
        # dispatcher -> deliverooTMS "Plans routes, assigns drivers and vehicles using"
        # driver -> mobileTMSApp "Views assigned transports, updates delivery status using"
        # warehouse_staff -> deliverooWMS "Manages storage and handling of goods using"
        # logistics_specialist -> deliverooTMS "Monitors logistics processes and resolves issues using"
        # fleet_manager -> deliverooTMS "Oversees vehicle availability and maintenance using"
        # recipient -> deliverooTMS "Receives notifications and confirms delivery using"
        external_partner -> deliverooTMS "Receives transport assignments or warehouse requests using"
        external_partner -> deliverooWMS "Receives transport assignments or warehouse requests using"
    }

    views {
        systemContext deliverooWMS "WMS_Context" {
            include *
            autoLayout
        }

        container deliverooWMS "WMS_Containers" {
            include *
            autoLayout
        }

        component WMS-API "Components" {
            include *
            autoLayout
        }

        systemContext deliverooTMS "TMS_Context" {
            include *
            autoLayout
        }

        container deliverooTMS "TMS_Containers" {
            include *
            autoLayout
        }

        component TMS-API "TMS_API" {
            include *
            autoLayout
        }

        styles {
            element "Person" {
                shape Person
                background #08427B
                color #ffffff
            }

            element "Software System" {
                background #1168BD
                color #ffffff
            }

            element "Container" {
                background #438DD5
                color #ffffff
            }

            element "Component" {
                background #85BBF0
                color #000000
            }

            element "external" {
                background #6b6b6b
            }

            element "database" {
                shape cylinder
                background #982e68
            }

            element "webApp" {
                shape WebBrowser
                background #207241
            }

            element "mobileApp" {
                shape MobileDevicePortrait
                background #207272
            }
        }

        branding {
            logo "deliveroo-gold.png"
        }
    }

}
