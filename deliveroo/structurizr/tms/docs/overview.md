# TMS – DUMMY docs

## Key Domain Events (Transportation)

These are significant events that change the state of transportation processes:

- **TransportOrderCreated**
- **TransportOrderVerified**
- **RoutePlanned**
- **CostCalculated**
- **OrderApproved**
- **DriverAssigned**
- **VehicleAssigned**
- **TransportStarted**
- **GoodsLoadedOntoVehicle**
- **VehiclePositionUpdated**
- **CheckpointReached**
- **DelayReported**
- **RouteChanged**
- **VehicleBreakdownDetected**
- **GoodsDelivered**
- **TransportCompleted**
- **TransportOrderCancelled**

---

## Core Business Rules (Transportation)

Business rules ensure correct, safe, and compliant transportation operations:

- **Order data validation**: When creating a transport order (locations, time, completeness)
- **Fleet availability check**: Before order approval
- **Load limits verification**: When assigning a vehicle (weight, volume)
- **Driver working hours control**: Before assigning a driver
- **Driver license/permit check**: When assigning a driver (e.g., hazardous goods)
- **Route feasibility check**: When planning the route (distance, restrictions)
- **Transport time window validation**: Before transport start
- **Real-time monitoring requirement**: During transport execution
- **Incident reporting requirement**: Upon breakdowns or delays

---

## Main Commands (Transportation)

Commands represent actions or intentions related to transportation operations:

- `CreateTransportOrder`
- `VerifyTransportOrder`
- `PlanRoute`
- `CalculateCost`
- `ApproveOrder`
- `AssignDriver`
- `AssignVehicle`
- `StartTransport`
- `LoadGoodsOntoVehicle`
- `UpdateVehiclePosition`
- `ReportDelay`
- `ReportBreakdown`
- `ChangeRoute`
- `CompleteTransport`
- `CancelTransportOrder`

---

## Aggregates (Transportation)

Aggregates encapsulate the state and business logic for transportation:

- **TransportOrder** (ID, route, status, goods, client)
- **Fleet** (vehicles, availability, maintenance)
- **Driver** (ID, qualifications, schedule, status)
- **Route** (planned path, checkpoints, restrictions)
- **TransportIncident** (incident details, status, resolution)

---

## Actors (Transportation)

### External Actors

- **Client** (initiates transport requests)
- **Goods Sender/Receiver**
- **External Transport Providers**

### Internal Actors

- **Transport Dispatcher**
- **Driver**
- **Fleet Manager**
- **Logistics Specialist**

---

## Integrations (Transportation)

- **GPS Tracking Systems**
- **Traffic and Weather Services**
- **Payment Platforms**
- **Warehouse Management Systems (WMS)**
- **Client ERP/Order Systems**
