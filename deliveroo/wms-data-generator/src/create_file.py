import os
from datetime import datetime
from src.generate_sql_inserts import generate_sql_inserts

def create_sql_file():
    # Read the schema from create-schema.sql
    with open("src/create-schema.sql", "r", encoding="utf-8") as schema_file:
        create_table_sql = schema_file.read()

    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"wms-{timestamp}.sql"
    filepath = os.path.join(output_dir, filename)

    # Generate SQL and stats
    result = generate_sql_inserts()
    sql_script = create_table_sql.strip() + "\n\n" + result["sql"]
    stats = result["stats"]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_script)

    print(f"Generated insert statements in {filepath}")
    print("\nFollowing records have been created:")
    for table, count in stats.items():
        print(f"- {table}: {count}") 