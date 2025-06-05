# ADR 004: Data Storage Strategy for Transport Orders and Tracking Data (DUMMY)

## Status

Accepted

## Context

The transportation service must store transport orders (business records) and high-volume tracking data (vehicle positions, status updates). The team must decide whether to use a single database for all data or separate storage solutions.

## Alternatives

- Single relational database for all data
- Separate databases: relational for business data, time-series/NoSQL for tracking data
- Data lake for all tracking and historical data

## Decision

We will use a relational database for transport orders and a time-series database for tracking data.

## Consequences

- **Easier**: Optimized storage and queries for each data type; scalable handling of high-volume tracking data; efficient business operations.
- **More difficult**: Increased operational complexity; need for integration and data consistency between databases; more complex backup and restore procedures.
