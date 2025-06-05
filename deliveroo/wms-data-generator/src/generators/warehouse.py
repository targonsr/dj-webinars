from src.generators.locations import warehouse_location
from faker import Faker

fake = Faker()

the_only_warehouse = {
    'id': 1,
    'location_id': warehouse_location['id'],
    'name': "Main Deliveroo Warehouse",
    'description': "Main warehouse for Deliveroo in Poland"
}

def warehouse_insert_sql(warehouse):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    return (
        f"INSERT INTO warehouse (warehouse_id, location_id, name) VALUES "
        f"({warehouse['id']}, {warehouse['location_id']}, {sql_str(warehouse['name'])});"
    )
