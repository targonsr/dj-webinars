# API Specification – Warehousing Service

## Warehouse Reservation Service

### POST /api/warehouse/reservations
Creates a new warehouse space reservation.

### GET /api/warehouse/reservations/{reservationId}
Returns details of a specific warehouse reservation.

### PUT /api/warehouse/reservations/{reservationId}
Updates an existing warehouse reservation (e.g., change duration, goods info).

### DELETE /api/warehouse/reservations/{reservationId}
Cancels a warehouse reservation.

### GET /api/warehouse/reservations
Lists all warehouse reservations (filter by status, date, client, etc.).

---

## Goods Handling Service

### POST /api/warehouse/goods/receive
Registers the receipt of goods at the warehouse (input: reservationId, goods details).

### POST /api/warehouse/goods/inspect
Records an inspection of received goods (input: inspection results, goodsId).

### POST /api/warehouse/goods/store
Confirms goods have been stored (input: location, goodsId).

### POST /api/warehouse/goods/pick
Marks goods as picked for transport or release (input: goodsId, destination).

### POST /api/warehouse/goods/load
Confirms goods have been loaded from the warehouse (input: goodsId, transportOrderId).

### POST /api/warehouse/goods/release
Releases goods from the warehouse to a client or carrier (input: goodsId, recipient).

### GET /api/warehouse/goods/{goodsId}
Returns details and status of specific goods in the warehouse.

### GET /api/warehouse/goods
Lists all goods currently stored in the warehouse (filter by status, type, client, etc.).

---

## Storage Conditions & Monitoring

### GET /api/warehouse/storage-conditions/{locationId}
Returns current storage conditions (e.g., temperature, humidity) for a specific warehouse location.

### POST /api/warehouse/storage-conditions/check
Triggers a check of storage conditions for specific goods or locations.

---

## Incident & Inventory Reporting

### POST /api/warehouse/incidents
Reports an incident in the warehouse (input: description, goods involved, severity).

### GET /api/warehouse/incidents/{incidentId}
Returns details of a specific warehouse incident.

### GET /api/warehouse/incidents
Lists all reported incidents (filter by date, type, status).

### GET /api/warehouse/inventory
Returns a summary of warehouse inventory (by type, status, client, etc.).

---

## Client & Integration Endpoints

### GET /api/clients/{clientId}/warehouse-reservations
Lists all warehouse reservations for a specific client.

### GET /api/clients/{clientId}/goods
Lists all goods stored in the warehouse for a specific client.

### POST /api/webhooks/warehouse-status
Endpoint for external systems to receive warehouse status updates (webhook).

---

## Authentication

### POST /api/auth/login
Authenticates a user and returns a JWT.

### POST /api/auth/logout
Logs out the user and invalidates the session.

