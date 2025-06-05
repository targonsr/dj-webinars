from faker import Faker
from src.config import DATA_QUANTITIES

fake = Faker()

def generate_customers():
    customers = []
    for i in range(DATA_QUANTITIES["NUM_CUSTOMERS"]):
        id_ = i + 1
        customers.append({
            'id': id_,
            'name': fake.company(),
            'email': fake.company_email(),
            'phone': fake.phone_number()
        })
    return customers

def customers_insert_sql(customers):
    def sql_str(s):
        return "'" + str(s).replace("'", "''") + "'"
    lines = [
        "INSERT INTO customer (customer_id, name, email, phone) VALUES"
    ]
    lines.append(",\n".join(
        f"({customer['id']}, {sql_str(customer['name'])}, {sql_str(customer['email'])}, {sql_str(customer['phone'])})"
        for customer in customers
    ) + ";")
    return "\n".join(lines)
