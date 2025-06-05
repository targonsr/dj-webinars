from faker import Faker
from datetime import datetime, timedelta
import random
import json
from src.config import DATA_QUANTITIES
from src.generators.locations import warehouse_location, location_insert_sql
from src.generators.warehouse import the_only_warehouse, warehouse_insert_sql
from src.generators.customers import generate_customers, customers_insert_sql
from src.generators.enums import ROLES, CARGO_EVENT_TYPES, roles_insert_sql, cargo_event_types_insert_sql
from src.generators.employees import (
    generate_employees, employees_insert_sql,
    generate_employee_roles, employee_roles_insert_sql,
    generate_employee_warehouses, employee_warehouses_insert_sql,
)
from src.generators.warehouse_structure import (
    zones_insert_sql,
    generate_aisles, aisles_insert_sql,
    generate_racks, racks_insert_sql,
    generate_shelves, shelves_insert_sql,
)
from src.generators.storage_requests_reservations import (
    generate_storage_requests, storage_requests_insert_sql,
    generate_storage_reservations, storage_reservations_insert_sql
)
from src.generators.storage_records_events import (
    generate_storage_records, storage_records_insert_sql,
    generate_storage_events_history, storage_events_history_insert_sql
)
from src.generators.payments import generate_payments, payments_insert_sql
import importlib
warehouse_structure = importlib.import_module('src.generators.warehouse_structure')
storage_records_events = importlib.import_module('src.generators.storage_records_events')

fake = Faker()

# --- Helper functions ---

def sql_str(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def sql_num(n):
    return str(n) if n is not None else "NULL"

def sql_date(dt):
    return f"'{dt.strftime('%Y-%m-%d')}'" if dt else "NULL"

def sql_timestamp(dt):
    return f"'{dt.strftime('%Y-%m-%d %H:%M')}'" if dt else "NULL"

def generate_sql_inserts():
    lines = []
    stats = {}

    # --- Locations ---
    lines.append("-- Locations")
    lines.append(location_insert_sql(warehouse_location))
    stats['locations'] = 1

    # --- Warehouses ---
    lines.append("\n-- Warehouses")
    lines.append(warehouse_insert_sql(the_only_warehouse))
    stats['warehouses'] = 1

    # --- Customers ---
    customers = generate_customers()
    lines.append("\n-- Customers")
    lines.append(customers_insert_sql(customers))
    stats['customers'] = len(customers)

    # --- Roles ---
    lines.append("\n-- Roles")
    lines.append(roles_insert_sql())
    stats['roles'] = len(ROLES)

    # --- Storage Event Types ---
    lines.append("\n-- Storage Event Types")
    lines.append(cargo_event_types_insert_sql().replace('cargo_event_type', 'storage_event_type'))
    stats['storage_event_types'] = len(CARGO_EVENT_TYPES)

    # --- Warehouse Structure ---
    zones = warehouse_structure.ZONE_NAMES
    lines.append("\n-- Zones")
    lines.append(zones_insert_sql(zones))
    stats['zones'] = len(zones)

    aisles = warehouse_structure.generate_aisles(zones)
    lines.append("\n-- Aisles")
    lines.append(aisles_insert_sql(aisles))
    stats['aisles'] = len(aisles)

    racks = warehouse_structure.generate_racks(aisles)
    lines.append("\n-- Racks")
    lines.append(racks_insert_sql(racks))
    stats['racks'] = len(racks)

    shelves = warehouse_structure.generate_shelves(racks)
    lines.append("\n-- Shelves")
    lines.append(shelves_insert_sql(shelves))
    stats['shelves'] = len(shelves)

    # --- Employees ---
    employees = generate_employees()
    lines.append("\n-- Employees")
    lines.append(employees_insert_sql(employees))
    stats['employees'] = len(employees)

    employee_roles = generate_employee_roles(employees, ROLES)
    lines.append("\n-- Employee Roles")
    lines.append(employee_roles_insert_sql(employee_roles))
    stats['employee_roles'] = len(employee_roles)

    # --- Employee Warehouses ---
    employee_warehouses = generate_employee_warehouses(employees)
    lines.append("\n-- Employee Warehouses")
    lines.append(employee_warehouses_insert_sql(employee_warehouses))
    stats['employee_warehouses'] = len(employee_warehouses)

    # --- Storage Requests ---
    storage_requests, accepted_requests, rejected_requests, pending_requests = generate_storage_requests(customers, employees, the_only_warehouse)
    lines.append("\n-- Storage Requests")
    lines.append(storage_requests_insert_sql(storage_requests))
    stats['storage_requests'] = len(storage_requests)

    # --- Storage Reservations ---
    storage_reservations = generate_storage_reservations(customers, accepted_requests, shelves)
    lines.append("\n-- Storage Reservations")
    lines.append(storage_reservations_insert_sql(storage_reservations))
    stats['storage_reservations'] = len(storage_reservations)

    # --- Storage Records ---
    # Only generate records for reservations (1:1 with accepted requests)
    storage_records = []
    for i, reservation in enumerate(storage_reservations):
        id_ = i + 1
        request_id = reservation['request_id']
        customer_id = reservation['customer_id']
        shelf_id = reservation['shelf_id']
        actual_entry_date = reservation['reserved_from']
        actual_exit_date = None if random.choice([True, False]) else actual_entry_date + timedelta(days=random.randint(1, 10))
        cargo_description = fake.sentence(nb_words=4)
        cargo_weight = round(random.uniform(100, 1000), 2)
        cargo_volume = round(random.uniform(1, 10), 2)
        storage_records.append({
            'id': id_,
            'request_id': request_id,
            'customer_id': customer_id,
            'shelf_id': shelf_id,
            'actual_entry_date': actual_entry_date,
            'actual_exit_date': actual_exit_date,
            'cargo_description': cargo_description,
            'cargo_weight': cargo_weight,
            'cargo_volume': cargo_volume
        })
    lines.append("\n-- Storage Records")
    lines.append(storage_records_insert_sql(storage_records))
    stats['storage_records'] = len(storage_records)

    # --- Payments ---
    payments = generate_payments(customers, storage_records)
    lines.append("\n-- Payments")
    lines.append(payments_insert_sql(payments))
    stats['payments'] = len(payments)

    return {"sql": "\n".join(lines), "stats": stats}
