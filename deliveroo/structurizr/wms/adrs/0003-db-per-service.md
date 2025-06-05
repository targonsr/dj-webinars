# ADR 003: Database per Service vs. Shared Database in Warehousing Microservices (DUMMY)

## Status

Proposed

## Context

In a distributed WMS, different microservices (inventory, reservations, incidents, goods handling) need to store and access data. Using a shared database can simplify queries but creates tight coupling, while separate databases can improve autonomy but complicate data consistency.

## Alternatives

- Shared database for all microservices
- Database per service (each microservice manages its own schema)
- Hybrid approach (shared for reference data, separate for transactional data)

## Decision

We propose to use the database per service pattern, where each microservice owns its own database.

## Consequences

- **Easier**: Independent scaling and deployment; improved service autonomy; better fault isolation.
- **More difficult**: Implementing cross-service queries and transactions; ensuring data consistency; increased operational overhead for managing multiple databases.
