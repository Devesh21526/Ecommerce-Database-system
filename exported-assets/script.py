# Let me analyze the database schema and queries to understand the system structure
import re

# Read and parse the database schema
with open('database-schema.sql', 'r') as f:
    schema_content = f.read()

# Extract table names and their relationships
tables = re.findall(r'CREATE TABLE IF NOT EXISTS (\w+)', schema_content)
print("Database Tables:")
for i, table in enumerate(tables, 1):
    print(f"{i}. {table}")

print(f"\nTotal tables: {len(tables)}")

# Analyze the main entities
main_entities = ['admin', 'supplier', 'customer', 'delivery_agent', 'product', 'orders']
relationship_tables = ['cart', 'order_product', 'product_review', 'da_review']
utility_tables = ['address', 'phone_number', 'wallet']

print(f"\nMain Entities: {main_entities}")
print(f"Relationship Tables: {relationship_tables}")
print(f"Utility Tables: {utility_tables}")