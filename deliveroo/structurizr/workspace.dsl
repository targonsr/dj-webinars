workspace "Deliveroo System" "A C4 model of a logistics system" {

    model {
        customer = person "Customer" "A customer who wants to buy products online"
        admin = person "Admin" "Staff member managing products and orders"
        paymentProvider = softwareSystem "Payment Provider" "Handles payment processing"

        deliveroo = softwareSystem "Logistics System" "Allows customers to browse and purchase products online" {
            webApp = container "Web Application" "Provides e-commerce functionality to customers" "React SPA"
            transportAPI = container "Transport API" "Provides transport via API" "Node.js" {
                authComponent = component "Authentication Component" "Handles user authentication"
                productComponent = component "Product Component" "Manages product catalog"
                orderComponent = component "Order Component" "Manages customer orders"
            }
            warehousingAPI = container "WMS API" "Provides warehousing via API" "Python" {
                WMSComponent = component "WMS Component" "Manages warehousing"
            }
            database = container "DatabaseTRANSPORT" "Stores product catalog, orders, etc." "PostgreSQL"
            databaseWMS = container "DatabaseWMS" "Stores product catalog, orders, etc." "PostgreSQL"

            webApp -> transportAPI "Makes API calls to" "JSON/HTTPS"
            transportAPI -> database "Reads from and writes to"
            transportAPI -> paymentProvider "Processes payments via"
            transportAPI -> warehousingAPI "Reads warehousing"
            warehousingAPI -> databaseWMS "Reads warehousing"
        }

        # customer -> deliveroo.webApp "Browses and purchases products using"
        customer -> deliveroo "Browses and purchases products using"
        admin -> deliveroo "Manages products and orders"
    }

    views {
        systemContext deliveroo "SystemContext" {
            include *
            autoLayout
        }

        container deliveroo "Containers" {
            include *
            autoLayout
        }

        # component deliveroo.apiApplication "Components" {
        #     include *
        #     autoLayout
        # }

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
        }
    }
}
