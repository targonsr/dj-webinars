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
