from faker import Faker
from src.config import DATA_QUANTITIES
from src.generators.enums import ROLES
from src.generators.warehouse import the_only_warehouse

fake = Faker()

def generate_employees():
    return [
        {
            'id': i + 1,
            'name': fake.name(),
            'email': fake.email(),
            'phone': fake.phone_number(),
            'hire_date': fake.date_between(start_date='-5y', end_date='today')
        }
        for i in range(DATA_QUANTITIES["NUM_EMPLOYEES"])
    ]

def employees_insert_sql(employees):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    def sql_date(dt):
        return f"'{dt.strftime('%Y-%m-%d')}'" if dt else "NULL"
    lines = ["INSERT INTO employee (employee_id, name, email, phone, hire_date) VALUES"]
    lines.append(",\n".join(
        f"({emp['id']}, {sql_str(emp['name'])}, {sql_str(emp['email'])}, {sql_str(emp['phone'])}, {sql_date(emp['hire_date'])})" for emp in employees
    ) + ";")
    return "\n".join(lines)

def generate_employee_roles(employees, roles):
    import random
    import numpy as np
    ROLE_WEIGHTS = {
        1: 0.03,   # warehouse_manager
        2: 0.07,   # logistics_coordinator
        3: 0.10,   # inventory_controller
        4: 0.18,   # receiving_clerk
        5: 0.18,   # shipping_clerk
        6: 0.23,   # forklift_operator
        7: 0.04,   # safety_officer
        8: 0.09,   # returns_specialist
        9: 0.08    # customer_service
    }
    role_ids = [role['id'] for role in roles]
    probabilities = [ROLE_WEIGHTS[rid] for rid in role_ids]
    employee_roles = []
    for emp in employees:
        # Base role assignment
        base_role = int(np.random.choice(role_ids, p=probabilities))
        employee_roles.append({
            'employee_id': emp['id'],
            'role_id': base_role,
            'assigned_date': fake.date_between(start_date=emp['hire_date'], end_date='today')
        })
        # 30% chance of secondary role
        if random.random() < 0.3:
            secondary_choices = [rid for rid in role_ids if rid != base_role]
            secondary_probs = [ROLE_WEIGHTS[rid] for rid in secondary_choices]
            secondary_probs = [p/sum(secondary_probs) for p in secondary_probs]
            secondary_role = int(np.random.choice(secondary_choices, p=secondary_probs))
            employee_roles.append({
                'employee_id': emp['id'],
                'role_id': secondary_role,
                'assigned_date': fake.date_between(start_date=emp['hire_date'], end_date='today')
            })
        # 10% chance of tertiary role (leadership only)
        if base_role == 1 and random.random() < 0.1:
            tertiary_role = random.choice([2, 7])  # logistics_coordinator or safety_officer
            employee_roles.append({
                'employee_id': emp['id'],
                'role_id': tertiary_role,
                'assigned_date': fake.date_between(start_date=emp['hire_date'], end_date='today')
            })
    return employee_roles

def employee_roles_insert_sql(employee_roles):
    def sql_date(dt):
        return f"'{dt.strftime('%Y-%m-%d')}'" if dt else "NULL"
    lines = ["INSERT INTO employee_role (employee_id, role_id, assigned_date) VALUES"]
    lines.append(",\n".join(
        f"({er['employee_id']}, {er['role_id']}, {sql_date(er['assigned_date'])})" for er in employee_roles
    ) + ";")
    return "\n".join(lines)

def generate_employee_warehouses(employees):
    # Assign all employees to the only warehouse, from their hire_date, with no assigned_until
    return [
        {
            'employee_id': emp['id'],
            'warehouse_id': the_only_warehouse['id'],
            'assigned_from': emp['hire_date'],
            'assigned_until': None
        }
        for emp in employees
    ]

def employee_warehouses_insert_sql(employee_warehouses):
    def sql_date(dt):
        return f"'{dt.strftime('%Y-%m-%d')}'" if dt else "NULL"
    lines = ["INSERT INTO employee_warehouse (employee_id, warehouse_id, assigned_from, assigned_until) VALUES"]
    lines.append(",\n".join(
        f"({ew['employee_id']}, {ew['warehouse_id']}, {sql_date(ew['assigned_from'])}, NULL)" for ew in employee_warehouses
    ) + ";")
    return "\n".join(lines)
