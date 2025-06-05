from faker import Faker
from datetime import timedelta
import random
from src.config import DATA_QUANTITIES
from src.generators.enums import ROLES

def generate_storage_requests(customers, employees, the_only_warehouse):
    fake = Faker()
    num_requests = DATA_QUANTITIES["NUM_STORAGE_REQUESTS"]
    customer_ids = [c['id'] for c in customers]
    # Randomize how many requests each customer gets
    requests_per_customer = {cid: 0 for cid in customer_ids}
    storage_requests = []
    accepted, rejected, pending = [], [], []
    # Precompute role-based employee lists
    logistics_coordinators = [e['id'] for e in employees if any(r['role_id'] == 2 for r in e.get('roles', []))]
    warehouse_managers = [e['id'] for e in employees if any(r['role_id'] == 1 for r in e.get('roles', []))]
    for i in range(num_requests):
        # Assign customer, some get many, some one, some none
        if random.random() < 0.15:
            customer_id = random.choice(customer_ids[:int(len(customer_ids)*0.2)])  # Some get many
        elif random.random() < 0.5:
            customer_id = random.choice(customer_ids[int(len(customer_ids)*0.2):int(len(customer_ids)*0.7)])
        else:
            customer_id = random.choice(customer_ids[int(len(customer_ids)*0.7):])
        requests_per_customer[customer_id] += 1
        warehouse_id = the_only_warehouse['id']
        # Status assignment
        r = random.random()
        if r < 0.25:
            status = 'accepted'
        elif r < 0.4:
            status = 'rejected'
        else:
            status = 'pending'
        # Date logic
        if status == 'accepted':
            entry = fake.date_time_between(start_date='-30d', end_date='now')
            exit = entry + timedelta(days=random.randint(5, 20))
            # Decision employee: 80% logistics coordinator, 20% warehouse manager
            if random.random() < 0.8 and logistics_coordinators:
                decision_employee_id = random.choice(logistics_coordinators)
            elif warehouse_managers:
                decision_employee_id = random.choice(warehouse_managers)
            else:
                decision_employee_id = None
            decision_date = entry - timedelta(days=random.randint(0, 3))
        elif status == 'rejected':
            entry = fake.date_time_between(start_date='-6m', end_date='-1w')
            exit = entry + timedelta(days=random.randint(5, 20))
            decision_employee_id = random.choice([None] + [e['id'] for e in employees])
            decision_date = entry - timedelta(days=random.randint(0, 3))
        else:  # pending
            if random.random() < 0.8:
                entry = fake.date_time_between(start_date='-7d', end_date='now')
            else:
                entry = fake.date_time_between(start_date='-30d', end_date='-7d')
            exit = entry + timedelta(days=random.randint(5, 20))
            decision_employee_id = None
            decision_date = None
        req = {
            'id': i + 1,
            'customer_id': customer_id,
            'warehouse_id': warehouse_id,
            'entry': entry,
            'exit': exit,
            'status': status,
            'decision_employee_id': decision_employee_id,
            'decision_date': decision_date
        }
        storage_requests.append(req)
        if status == 'accepted':
            accepted.append(req)
        elif status == 'rejected':
            rejected.append(req)
        else:
            pending.append(req)
    return storage_requests, accepted, rejected, pending

def storage_requests_insert_sql(storage_requests):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M') + "'" if dt else "NULL"
    lines = ["INSERT INTO storage_request (request_id, warehouse_id, customer_id, requested_entry_date, requested_exit_date, status, decision_employee_id, decision_date) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['warehouse_id']}, {sr['customer_id']}, {sql_timestamp(sr['entry'])}, {sql_timestamp(sr['exit'])}, {sql_str(sr['status'])}, {sr['decision_employee_id'] if sr['decision_employee_id'] else 'NULL'}, {sql_timestamp(sr['decision_date'])})"
        for sr in storage_requests
    ) + ";")
    return "\n".join(lines)

def generate_storage_reservations(customers, accepted_storage_requests, shelves):
    fake = Faker()
    storage_reservations = []
    for i, req in enumerate(accepted_storage_requests):
        id_ = i + 1
        request_id = req['id']
        customer_id = req['customer_id']
        shelf_id = shelves[i % len(shelves)]['id']
        reserved_weight = random.randint(100, 1000)
        reserved_volume = round(random.uniform(1, 10), 2)
        reserved_from = req['entry']
        reserved_until = req['exit']
        status = 'active'
        storage_reservations.append({
            'id': id_,
            'request_id': request_id,
            'customer_id': customer_id,
            'shelf_id': shelf_id,
            'reserved_weight': reserved_weight,
            'reserved_volume': reserved_volume,
            'reserved_from': reserved_from,
            'reserved_until': reserved_until,
            'status': status
        })
    return storage_reservations

def storage_reservations_insert_sql(storage_reservations):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_timestamp(dt):
        return f"'" + dt.strftime('%Y-%m-%d %H:%M') + "'" if dt else "NULL"
    lines = ["INSERT INTO storage_reservation (reservation_id, request_id, customer_id, shelf_id, reserved_weight, reserved_volume, reserved_from, reserved_until, status) VALUES"]
    lines.append(",\n".join(
        f"({sr['id']}, {sr['request_id']}, {sr['customer_id']}, {sr['shelf_id']}, {sr['reserved_weight']}, {sr['reserved_volume']}, {sql_timestamp(sr['reserved_from'])}, {sql_timestamp(sr['reserved_until'])}, {sql_str(sr['status'])})"
        for sr in storage_reservations
    ) + ";")
    return "\n".join(lines)
