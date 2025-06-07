prompt (lovable):

```
I would like you to create an react and react-router-based interface application, which is going to be a customer portal for a logistics transport company called Deliveroo.

So here the customer logs in and after that they can see the dashboard with their current Deliveries, transport orders, drivers, trucks and the payments, and so on and so forth. you can use some 3rd party OSS for the datatable.

There is a login page, there is a dashboard page, there is some customer settings, and there are some other pages that we don't want to walk into.

So I would like you to bootstrap such application in react and react query for data loading. I would like you to provide a little bit of hard coded data for these pages. After logging in, there should be a header or any other kind of menu. There should be a log out button, obviously.

In the menu (collapsible side menu) there should be a user profile thing to provide the profile.

To see the user profile, it can be very basic, not a big deal. And there would be a main page with the dashboard after the login. The login should be hard coded in a way that if you pass whatever, then you're just logged in. Because apart from the dashboard there should be some links with some sample blank pages, or maybe not blank basically, some kind of test pages for other files to add. So use the design from the attached image, and make it look very, very nice. make it work correctly.
```

**follow up prompt**

```
Please provide a simplistic panel for notifications when you click on the notifications button. The notifications panel from dashboard page should be used there (moved permanently).

Replace the "customer dashboard" with "staff dashboard".

Both drivers and trucks subpages should include a simple graph with stats.

There should be a Transport Order Details page which displays a linear history of events related to that order (statused, details, which employee executed them, when, etc). Clicking "View Details" in "All orders" row should navigate to these details.

Track shipment button should move to a subpage with a shipment details and a map.

"Deliveroo" link is clickable (main page). On the left of the "deliveroo" there's a truck icon (also clickable)
```

**follow up prompt**

```
## moving logout button

Let's move the logout, but only in the wide (desktop view). Move the logoout button to the top, to the right from the notification icon. Currently it's at the bottom left hand side corner. It shouldn't be there.

in the mobile view, the logout is at the bottom of the collapsible menu - and it should stay there (as it is now), we're changing the non-mobile view only.

## track fleet

the "Track Shipment" button from the main dashboard should be renamed to "track fleet" and lead to a new subpage - It should display an interactive map, the same library used underneath as in the shipment subpage. Here in the track fleet there should be multiple pins so that we can see multiple trucks visible on the map. Ideally, there would be some randomized route from point A to point B and the pin would display the current location of the truck.

## interactive map

In the track shipment, in the live map, please include a map such, It could use open source software such as leaflet.js.

## new subpage

Please create a new subpage "Urgent"  which will include actionable items for managers/supervisors to take care of.

## drivers details subpage

In the drivers sub page, each single driver should be clickable and move to a driver's details. So there, I would be able to see the list of recent shipments and the brief information about the contract and generally information about the employee itself. The shipments inside the driver details subpage should also link to, well, let's say, random shipments in the shipments details. It should be also outlined what is the status of the shipment, whether it's done or not yet. And there should be some filters. For each driver, I should have a button "see the shipments of that driver" which would link me to the shipment list with according appropriate filters set.

## filtering state

The filtering state should be implemented using the React Jotai library.

## shipments list

Shipment list should include some filters. For instance, there should be a filter by driver or filter by location, a filter by status. These all should work correctly and accordingly to each other.

## react query

I want you to introduce React Query to the entire application. All the listings, charts, data tables, etc. should be loaded via queries. And at this point you can freely use the mocks. Make sure that the order listing and the order details relate to the same mock dataset. Same for shipments. Make sure that different shipments would relate to the object from the dataset, the relevant one. Because now it seems that a huge part of the shipment details is hardcoded.
```

**follow up prompt** (final, raw, dictated; see enhanced by AI below):

```
# Trucks subpage

Please rename the trucks, label/link and trucks subpage to a "Fleet Management". Inside this supple, you need to have tabs - maybe horizontal? 
The first cap would be "Fleet Maintenance" - Here there would be some suggestions and notifications about upcoming required regular services, you know: Battery, belts, chases, suspension brakes, oil, filter change, fluid checks, exhaust system inspection, etc.

Another tab would be called "Vehicles Management". Here we would have a listing of the trucks available.

The last tab would be called "old management panel" and it would include exactly what we have right now in the existing "TruckFleet" file. So what we've had right now, don't remove it, just add two more and put them under tabs. Also, I want a notification to appear near the names of the tabs. So there might be some urgent thing like a car that requires immediate repair that would be considered as an urgent thing, not sure how to say it, something that a manager needs to take care of. And the same for trucks or services or maintenance generally. So there should be something that needs immediate attention. And the number of these should be basically a number inside a red circle, similar as we have in notifications, just without the bell, just the number. Of course, if there are notifications such as this one. So let's say there would be three notifications in the fleet maintenance, and that means inside this tab there would be three urgent things to take care of, and there would be one notification near the "Vehicles Management" - And there would be one urgent item to take care of inside vehicle management. And finally, in the old management tab there will be no notifications because this feature didn't exist back then.

# Orders

Orders subpage needs to be renamed to transportation orders. There would also be tabs:
1. Order Transportation Overview
2. Incoming Requests
3. In Transit
4. Delivered
5. Payments

The "Order Transportation Overview" Would resemble a kanban board where Each order is a row and is moved into various stages and each status would be visualized as a column. The component which visualizes the order board would allow to configure how many stages are there, which represent obviously the columns. So this would be a configuration thing and the orders themselves would be basically fetched using reactquery hook. So each order is actually not a whole row, but is actually a cell that can be moved between the columns. But as for now, there is no drag and drop, so don't install anything like that. But we need this camp and board to be very attractive visually, very nice. And each column should have a predefined color that would align with the status of the order.

The "2. Incoming Requests" would be a list of orders submitted by the customers, they Include information such as the address, the preferred date and the type of cargo, its mass and its volume. This tab would also allow to specify which driver and which vehicle would actually do the transport. Potentially, there would be some system recommendation. However, at this point the system would require a logistics manager to approve the transit. And also, if there is a conflict, it would be outlined. A conflict is when a truck or a driver has been assigned to such an order and they are already being reserved in a different time or place, so anything is just unavailable. So these conflicts should also be outlined here. Also, there would be some estimations on the time, the cost, the distance, etc. There would also be a link to see the suggested route on the map. If the incoming request has been approved, then it should be basically outlined here that it is approved.

The "3. In Transit" would be a list of orders that are currently being transported. Here the information would display the progress. So how much time did it take, how much distance has been done, moved, whatever you call it. If there is some delay or if there is an estimated delay, then there should be information about it. And first and foremost, if there is any breakdown or any unexpected situation, then it should also be outlined here. If the transport has been completed, then it should be outlined that yes, it has been completed. For the orders that are not yet in-transit, there would be an ambient N/A label.

The "4. Delivered" would be a list of orders that have been delivered. For the deliveries that are not yet delivered, there would be an ambient N/A label. For the packages or cargo that have been delivered, there would be information about the acceptance by the person who has received them. So there would be also a link to external system to see the signature of who has accepted receiving the package. Yeah, and a timestamp of it. 

The "5. Payments" would be a list of payments that have been issued. Payments can be pending, paid, overdue, partially paid, cancelled. For each issued payment there would be a link to external system to an invoice. Each link to invoices would look like: http://invoicing.deliveroo.com/invoice/<NUMBER>. Information includes the amount, payment due date and payment date, if it has been paid, payment status, transaction or payment ID, who is the payer, who is the payee, probably our delivery company and some currency, things like that.

# Metrics for Deliveroo App

Please provide new dashboard widgets that would be displayed in the dashboard page at the top. The current KPIs pannel can be removed (it's irrelevant once better dashboards get in). Below is a description of these widgets:

1. **Perfect Order Rate**
   - **Description:** Measures the percentage of orders completed without any errors, delays, or damage.
   - **Why it matters:** Directly reflects customer satisfaction and helps reduce the costs associated with complaints and returns.

2. **Order Accuracy Rate**
   - **Description:** Tracks how often orders are fulfilled exactly as requested (right items, quantities, and destinations).
   - **Why it matters:** Ensures operational reliability and reduces the need for costly corrections or repeat deliveries.

3. **Cost Per Delivery**
   - **Description:** Calculates the average total cost to complete a single delivery, including fuel, driver wages, and other expenses.
   - **Why it matters:** Critical for understanding and improving the profitability of your logistics operations.

4. **On-Time Delivery Rate**
   - **Description:** Shows the percentage of deliveries that arrive at their destination within the promised time window.
   - **Why it matters:** A key indicator of service reliability and a major factor in customer retention and competitiveness.

5. **Vehicle Utilization Rate**
   - **Description:** Measures how efficiently your vehicles are being used, based on the proportion of time they are actively transporting goods.
   - **Why it matters:** Higher utilization means better asset use and lower operational costs.

# New Subpage: Incidents

This subpage would be a list of incidents that have been reported. Incidents include: Vehicle collision, Cargo, Spell or Leak, Cargo loss, Injury, Fire explosion, Equipment failure, FET or Vandalism, Road departure, Blocked route, and so on.
Typical incident information include the type and the description, the date, time, location, the vehicles and personnel involved, the sequence of events, the immediate action-stake and endless supporting, evidence like photos, reports, whatever.
The statuses include reported, under investigation, action in progress, resolved.
And these could be like past things and also something that requires immediate attention.

# New subpage: Claims

Claims would be customers, complaints, data mining, that something was wrong with the transport.
Types of claims include damage claims, a shipment arrived damaged, loss claim shipment, lost and not delivered, shortage claim, only part of the shipment delivered, delay claim, it delivered too late, refused claim, shipment refused by recipient without valid reason, and carrier accident claim, so the goods was damaged due to transport accident.
claim information: Shipment details (ID, date, origin, destination), Description of issue (damage, loss, shortage, etc.), Supporting documents (photos, proof of delivery, bill of lading). Claimed amount
Claims have following statuses. Submitted, reviewed, approved, rejected, closed.
```

**follow up prompt** (final, enhanced by AI, perplexity):

```
Implement the following changes:

## 1. Fleet Management

Rename the "Trucks" section and all related labels/links to **Fleet Management**. Structure the Fleet Management subpage using horizontal tabs:

### Tabs

- **Fleet Maintenance**
  - Suggestions and notifications for upcoming required services (e.g., battery, belts, chassis, suspension, brakes, oil and filter changes, fluid checks, exhaust system inspections).
  - Display urgent maintenance needs as notification badges (red circles with numbers) on the tab, indicating items requiring immediate attention.

- **Vehicles Management**
  - List of all available trucks.
  - Display urgent vehicle-related issues as notification badges on the tab.

- **Old Management Panel**
  - Retain the current "TruckFleet" functionality here.
  - No notification badge is needed for this tab.

---

## 2. Transportation Orders

Rename the "Orders" subpage to **Transportation Orders**. Organize it into the following tabs:

### Tabs

1. **Order Transportation Overview**
   - Visualize orders on a Kanban board.
   - Each order is a cell that moves between columns representing statuses/stages (configurable).
   - Each column has a predefined color aligned with the order status.
   - Orders are fetched using a `react-query` hook.
   - No drag-and-drop for now, but the board should be visually attractive.

2. **Incoming Requests**
   - List of customer-submitted orders.
   - Display details: address, preferred date, cargo type, mass, volume.
   - Assign driver and vehicle (with system recommendations if available).
   - Logistics manager approval required for each order.
   - Highlight conflicts (e.g., double-booked trucks/drivers).
   - Show estimated time, cost, distance, and a link to the suggested route on the map.
   - Approved requests are clearly marked.

3. **In Transit**
   - List of orders currently being transported.
   - Show progress: elapsed time, distance covered.
   - Display delays or estimated delays.
   - Highlight breakdowns or unexpected events.
   - Completed transports are marked as such.
   - Orders not yet in transit display an "N/A" label.

4. **Delivered**
   - List of delivered orders.
   - For undelivered orders, display "N/A".
   - For delivered orders: show recipient acceptance, link to external system for signature, and timestamp.

5. **Payments**
   - List of issued payments.
   - Payment statuses: pending, paid, overdue, partially paid, cancelled.
   - Each payment links to an external invoice (e.g., `http://invoicing.deliveroo.com/invoice/<NUMBER>`).
   - Display amount, due date, payment date (if paid), status, transaction/payment ID, payer, payee, currency, etc.

---

## 3. Dashboard Metrics (KPIs)

Replace the current KPIs panel with the following widgets at the top of the dashboard:

- **Perfect Order Rate**
  - % of orders completed without errors, delays, or damage.
  - Indicates customer satisfaction and reduces complaint/return costs.

- **Order Accuracy Rate**
  - % of orders fulfilled exactly as requested.
  - Ensures reliability and reduces costly corrections.

- **Cost Per Delivery**
  - Average total cost per delivery (fuel, wages, etc.).
  - Key for profitability analysis.

- **On-Time Delivery Rate**
  - % of deliveries arriving within the promised window.
  - Measures service reliability and customer retention.

- **Vehicle Utilization Rate**
  - % of time vehicles are actively transporting goods.
  - Higher rates mean better asset use and lower costs.

---

## 4. Incidents Subpage

A dedicated subpage listing all reported incidents, including:

- **Types:** Vehicle collision, cargo spill/leak, cargo loss, injury, fire/explosion, equipment failure, theft/vandalism, road departure, blocked route, etc.
- **Incident Details:** Type, description, date, time, location, involved vehicles/personnel, sequence of events, immediate actions taken, supporting evidence (photos, reports).
- **Statuses:** Reported, under investigation, action in progress, resolved.
- **Urgency:** Incidents requiring immediate attention are highlighted.

---

## 5. Claims Subpage

A dedicated subpage for customer complaints and claims, such as:

- **Types of Claims:**
  - Damage claim: Shipment arrived damaged.
  - Loss claim: Shipment lost/not delivered.
  - Shortage claim: Only part of the shipment delivered.
  - Delay claim: Delivered too late.
  - Refused claim: Shipment refused by recipient without valid reason.
  - Carrier accident claim: Goods damaged due to transport accident.

- **Claim Information:** Shipment details (ID, date, origin, destination), issue description, supporting documents (photos, proof of delivery, bill of lading), claimed amount.
- **Claim Statuses:** Submitted, reviewed, approved, rejected, closed.

---

## Logistics Improvements & Recommendations

- **Notification System:** Use consistent, visible notification badges for urgent issues across all relevant tabs and lists.
- **Conflict Highlighting:** Clearly outline resource (driver/vehicle) conflicts and provide resolution suggestions to logistics managers.
- **Approval Workflow:** Ensure all critical steps (e.g., order approval, claim review) are tracked and auditable for compliance and transparency.
- **External Integrations:** Maintain seamless links to external systems (e.g., invoicing, signature verification) for traceability.
- **Incident & Claim Tracking:** Enable filtering and prioritization by urgency, type, and status to support rapid response and resolution.
- **User Roles & Permissions:** Ensure that only authorized users can approve orders, resolve incidents, or process claims.
```
