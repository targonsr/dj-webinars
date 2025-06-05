import random
from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
import os

from logger import setup_logger

try:
    from jsonify import jsonify
except ImportError:
    from flask import jsonify

logger = setup_logger()

app = Flask(__name__)

# Set up database connection (adjust connection string as needed)
DB_URL = os.environ.get('POSTGRES_URL', 'postgresql+psycopg2://admin:strongpassword123@postgres:5432/deliveroo')
db_engine = create_engine(DB_URL)

@app.route('/health', methods=['GET'])
def health():
    logger.debug('Health check requested')
    return 'OK', 200

@app.route('/payments', methods=['GET'])
def payments():
    status = request.args.get('status', 'pending')
    query = text('''
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
            status = :status
        ORDER BY
            payment_date NULLS LAST, payment_id;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'status': status})
        payments = [dict(row) for row in result.mappings()]
    logger.info(f"Fetched {len(payments)} payments with status '{status}'")
    return jsonify(payments)

@app.route('/warehouse/<int:warehouse_id>', methods=['GET'])
def get_warehouse_employees(warehouse_id):
    query = text('''
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
            ew.warehouse_id = :warehouse_id
        GROUP BY
            e.employee_id, e.name, e.email, e.phone, e.hire_date
        ORDER BY
            e.name;
    ''')
    with db_engine.connect() as conn:
        result = conn.execute(query, {'warehouse_id': warehouse_id})
        employees = [dict(row) for row in result]
    logger.info(f"Fetched {len(employees)} employees for warehouse {warehouse_id}")
    return jsonify(employees)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
