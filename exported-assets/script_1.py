# Analyze the query files to understand the business functionality
import re

# Read embedded queries to understand key features
with open('embedded-queries.sql', 'r') as f:
    embedded_content = f.read()

# Read simple queries to understand operations
with open('simple-queries.sql', 'r') as f:
    simple_content = f.read()

# Read OLAP queries to understand analytics
with open('olap-queries.sql', 'r') as f:
    olap_content = f.read()

# Read triggers to understand automated processes
with open('triggers.sql', 'r') as f:
    triggers_content = f.read()

# Extract key functionalities from comments
embedded_queries = re.findall(r'-- Query-\d+: (.+)', embedded_content)
simple_queries = re.findall(r'-- Query-\d+: (.+)', simple_content)
olap_queries = re.findall(r'-- Query-\d+: (.+)', olap_content)
trigger_functions = re.findall(r'-- Trigger-\d+: (.+)', triggers_content)

print("=== EMBEDDED QUERIES (Core Features) ===")
for i, query in enumerate(embedded_queries, 1):
    print(f"{i}. {query}")

print(f"\n=== SIMPLE QUERIES (Operations) ===")
for i, query in enumerate(simple_queries, 1):
    print(f"{i}. {query}")

print(f"\n=== OLAP QUERIES (Analytics) ===")
for i, query in enumerate(olap_queries, 1):
    print(f"{i}. {query}")

print(f"\n=== TRIGGERS (Automated Processes) ===")
for i, trigger in enumerate(trigger_functions, 1):
    print(f"{i}. {trigger}")