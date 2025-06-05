ROLES = [
    {'id': 1, 'name': 'warehouse_manager', 'description': 'Oversees all warehouse operations, staff, and safety.'},
    {'id': 2, 'name': 'logistics_coordinator', 'description': 'Manages logistics and distribution processes.'},
    {'id': 3, 'name': 'inventory_controller', 'description': 'Manages inventory accuracy, cycle counts, and stock reconciliation.'},
    {'id': 4, 'name': 'receiving_clerk', 'description': 'Handles inbound shipments, inspects and records received goods.'},
    {'id': 5, 'name': 'shipping_clerk', 'description': 'Prepares and processes outbound shipments and documentation.'},
    {'id': 6, 'name': 'forklift_operator', 'description': 'Operates forklifts and other material handling equipment within the warehouse.'},
    {'id': 7, 'name': 'safety_officer', 'description': 'Ensures safety and compliance in warehouse operations.'},
    {'id': 8, 'name': 'returns_specialist', 'description': 'Handles returns and returns processing.'},
    {'id': 9, 'name': 'customer_service', 'description': 'Handles customer inquiries and complaints.'}
]

CARGO_EVENT_TYPES = [
    {'id': 1, 'name': 'RECEIVED', 'description': 'Cargo received at warehouse'},
    {'id': 2, 'name': 'MOVED', 'description': 'Cargo moved to another shelf'},
    {'id': 3, 'name': 'DISPATCHED', 'description': 'Cargo dispatched from warehouse'},
    {'id': 4, 'name': 'DAMAGED', 'description': 'Cargo found damaged'},
    {'id': 5, 'name': 'LOST', 'description': 'Cargo missing or lost'},
    {'id': 6, 'name': 'CUSTOMER_CONTACT', 'description': 'Contact with customer regarding storage'},
    {'id': 7, 'name': 'QUALITY_ISSUE', 'description': 'Quality-related issue reported'},
    {'id': 8, 'name': 'SAFETY_INCIDENT', 'description': 'Safety or accident incident reported'}
]

def sql_str(s):
    return "'" + str(s).replace("'", "''") + "'"

def roles_insert_sql():
    lines = ["INSERT INTO role (role_id, name, description) VALUES"]
    lines.append(",\n".join(
        f"({role['id']}, {sql_str(role['name'])}, {sql_str(role['description'])})" for role in ROLES
    ) + ";")
    return "\n".join(lines)

def cargo_event_types_insert_sql():
    lines = ["INSERT INTO cargo_event_type (event_type_id, name, description) VALUES"]
    lines.append(",\n".join(
        f"({cet['id']}, {sql_str(cet['name'])}, {sql_str(cet['description'])})" for cet in CARGO_EVENT_TYPES
    ) + ";")
    return "\n".join(lines)
