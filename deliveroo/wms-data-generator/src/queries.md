# fetch employees with roles, by warehouse

```sql
SELECT
    e.employee_id,
    e.name AS employee_name,
    e.email,
    e.phone,
    e.hire_date,
    STRING_AGG(r.name, ', ') AS roles
FROM
    employee e
JOIN
    employee_warehouse ew ON e.employee_id = ew.employee_id
JOIN
    employee_role er ON e.employee_id = er.employee_id
JOIN
    role r ON er.role_id = r.role_id
WHERE
    ew.warehouse_id = $1 -- replace with ID
GROUP BY
    e.employee_id, e.name, e.email, e.phone, e.hire_date
ORDER BY
    e.name;

```

# get all pending payments

```sql
SELECT
    payment_id,
    storage_record_id,
    customer_id,
    amount,
    currency,
    status,
    payment_date,
    external_reference
FROM
    payment
WHERE
    status = 'pending'
ORDER BY
    payment_date NULLS LAST, payment_id;
```

# get all payments by customer

```sql
SELECT
    payment_id,
    storage_record_id,
    customer_id,
    amount,
    currency,
    status,
    payment_date,
    external_reference
FROM
    payment
WHERE
    customer_id = $1   -- Replace $1 with the desired customer_id or use as a parameter
ORDER BY
    payment_date NULLS LAST, payment_id;
```

# get pending payments by customer

```sql
-- List all payments with status 'pending' for a specific customer.
SELECT
    payment_id,
    storage_record_id,
    customer_id,
    amount,
    currency,
    status,
    payment_date,
    external_reference
FROM
    payment
WHERE
    customer_id = $1 -- customer_id parameter
    AND status = 'pending'
ORDER BY
    payment_date NULLS LAST,
    payment_id;
```

# list pending storage requests

```sql
-- Show all storage requests still pending; add an index on status for faster filtering.
-- Suggested index (run once):
-- CREATE INDEX IF NOT EXISTS idx_storage_request_status ON storage_request(status);
SELECT
    request_id,
    customer_id,
    warehouse_id,
    requested_entry_date,
    requested_exit_date,
    status
FROM
    storage_request
WHERE
    status = 'pending'
ORDER BY
    requested_entry_date;
```

# storage event history for storage record

```sql
-- Retrieve all event history rows for a storage record ordered chronologically.
SELECT
    event_id,
    storage_record_id,
    event_type_id,
    event_time,
    employee_id,
    details
FROM
    storage_event_history
WHERE
    storage_record_id = $1 -- storage_record_id parameter
ORDER BY
    event_time;
```
