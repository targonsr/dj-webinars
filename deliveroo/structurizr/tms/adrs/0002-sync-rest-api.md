# ADR 002: Synchronous vs. Asynchronous Communication with External Partners (DUMMY)

## Status

Accepted

## Context

The transportation service needs to communicate with external partners (e.g., GPS tracking, payment providers, third-party carriers). The team must determine whether to use synchronous (API calls) or asynchronous (event/message-based) communication.

## Alternatives

- Synchronous REST API calls
- Asynchronous messaging (e.g., message queues, event brokers)
- Hybrid approach

## Decision

We will use synchronous REST API calls for communication with external partners.

## Consequences

- **Easier**: Simpler integration and error handling; immediate feedback for business processes; easier to debug.
- **More difficult**: Tight coupling to partner system availability; less resilient to partner outages; potential for increased latency.
