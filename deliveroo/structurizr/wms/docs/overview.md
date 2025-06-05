# Logistics and Transport System – 

## Key Domain Events

These are significant occurrences that change the state of the system or process:

- **TransportOrderCreated**
- **OrderVerified**
- **RoutePlanned**
- **CostCalculated**
- **OrderApproved**
- **DriverAssigned**
- **VehicleAssigned**
- **TransportStarted**
- **GoodsLoaded**
- **VehiclePositionUpdated**
- **DelayReported**
- **VehicleBreakdownDetected**
- **GoodsDelivered**
- **TransportCompleted**
- **OrderCancelled**

---

## Core Business Rules

Business rules ensure process integrity and compliance:

- **Order data validation**: When creating an order (check locations, time, completeness)
- **Fleet availability check**: Before order approval
- **Load limits verification**: When assigning a vehicle (weight, volume)
- **Driver working hours control**: Before assigning a driver
- **Driver license/permit check**: When assigning a driver (e.g., ADR)
- **Warehouse requirements check**: When reserving warehouse space
- **Payment validation**: Before starting transport

---

## Main Commands

Commands represent user or system intentions that trigger changes:

- `CreateTransportOrder`
- `VerifyOrder`
- `PlanRoute`
- `AssignDriver`
- `AssignVehicle`
- `StartTransport`
- `UpdateVehiclePosition`
- `ReportBreakdown`
- `CompleteTransport`
- `CancelOrder`

---

## Aggregates

Aggregates are the main domain objects encapsulating business logic and state:

- **TransportOrder**
- **Fleet**
- **Driver**
- **Warehouse**
- **Client**

---

## Actors

### External Actors

- **Client** (order initiator)
- **Goods Sender/Receiver**
- **External Suppliers** (e.g., partner warehouses)

### Internal Actors

- **Transport Dispatcher**
- **Driver**
- **Logistics Specialist**
- **Fleet Administrator**

---

## Integrations

- **GPS Tracking Systems**
- **Payment Platforms**
- **External Warehouse APIs**
- **Traffic and Weather Services**

---

## Summary

This event storming snapshot identifies the essential events, business rules, commands, aggregates, actors, and integrations for a logistics and transport system. It provides a bird’s-eye view of the system’s domain, ensuring all critical business processes and technical touchpoints are covered for further detailed analysis and system design.
