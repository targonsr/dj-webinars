# API Specification – DUMMY Transportation Service

## Transport Order Service

### POST /api/transport-orders
Creates a new transport order.

### GET /api/transport-orders/{orderId}
Returns details of a specific transport order.

### PUT /api/transport-orders/{orderId}
Updates an existing transport order (e.g., change delivery address, update goods info).

### DELETE /api/transport-orders/{orderId}
Cancels a transport order.

### GET /api/transport-orders
Lists all transport orders (filter by status, date, client, etc.).

---

## Route Planning Service

### POST /api/routes/plan
Plans a route for a given transport order (input: origin, destination, constraints).

### GET /api/routes/{routeId}
Returns details of a specific planned route.

---

## Driver and Vehicle Assignment

### POST /api/transport-orders/{orderId}/assign-driver
Assigns a driver to a transport order.

### POST /api/transport-orders/{orderId}/assign-vehicle
Assigns a vehicle to a transport order.

### GET /api/drivers/available
Lists available drivers for assignment.

### GET /api/vehicles/available
Lists available vehicles for assignment.

---

## Transport Execution & Tracking

### POST /api/transport-orders/{orderId}/start
Marks the transport as started.

### POST /api/transport-orders/{orderId}/load-goods
Confirms goods have been loaded onto the vehicle.

### POST /api/transport-orders/{orderId}/update-position
Updates the current position of the vehicle (input: GPS coordinates, timestamp).

### POST /api/transport-orders/{orderId}/report-delay
Reports a delay in transport (input: reason, estimated delay).

### POST /api/transport-orders/{orderId}/report-breakdown
Reports a vehicle breakdown (input: description, location).

### POST /api/transport-orders/{orderId}/change-route
Requests a route change for the ongoing transport (input: new route data).

### POST /api/transport-orders/{orderId}/complete
Marks the transport as completed.

---

## Incident & Status Reporting

### GET /api/transport-orders/{orderId}/status
Returns the current status and history of the transport order.

### GET /api/transport-orders/{orderId}/incidents
Lists all incidents (delays, breakdowns, etc.) for a transport order.

---

## Client & Integration Endpoints

### GET /api/clients/{clientId}/transport-orders
Lists all transport orders for a specific client.

### POST /api/webhooks/transport-status
Endpoint for external systems to receive transport status updates (webhook).

---

## Authentication

### POST /api/auth/login
Authenticates a user and returns a JWT.

### POST /api/auth/logout
Logs out the user and invalidates the session.
