import plotly.graph_objects as go
import plotly.express as px
import json
import numpy as np

# Parse the data
data = {
  "api_endpoints": [
    {
      "role": "Admin",
      "color": "#1FB8CD",
      "endpoints": [
        {"path": "/api/admin/dashboard", "method": "GET", "tables": ["customer", "supplier", "delivery_agent", "orders", "product", "order_product"]},
        {"path": "/api/admin/users/:role", "method": "GET", "tables": ["customer", "supplier", "delivery_agent"]},
        {"path": "/api/admin/analytics", "method": "GET", "tables": ["orders", "order_product", "product", "customer", "address"]},
        {"path": "/api/admin/orders", "method": "GET", "tables": ["orders", "order_product", "product", "customer"]}
      ]
    },
    {
      "role": "Supplier",
      "color": "#2E8B57", 
      "endpoints": [
        {"path": "/api/supplier/products", "method": "GET", "tables": ["product", "product_review"]},
        {"path": "/api/supplier/products", "method": "POST", "tables": ["product"]},
        {"path": "/api/supplier/products/:id", "method": "PUT", "tables": ["product"]},
        {"path": "/api/supplier/products/:id", "method": "DELETE", "tables": ["product"]},
        {"path": "/api/supplier/analytics", "method": "GET", "tables": ["product", "order_product", "orders"]},
        {"path": "/api/supplier/inventory", "method": "GET", "tables": ["product"]}
      ]
    },
    {
      "role": "Customer",
      "color": "#5D878F",
      "endpoints": [
        {"path": "/api/customer/products", "method": "GET", "tables": ["product", "product_review", "supplier"]},
        {"path": "/api/customer/cart", "method": "GET", "tables": ["cart", "product"]},
        {"path": "/api/customer/cart", "method": "POST", "tables": ["cart", "product"]},
        {"path": "/api/customer/orders", "method": "POST", "tables": ["orders", "order_product", "cart", "product", "delivery_agent"]},
        {"path": "/api/customer/orders", "method": "GET", "tables": ["orders", "order_product", "product"]},
        {"path": "/api/customer/wallet", "method": "GET", "tables": ["wallet"]},
        {"path": "/api/customer/reviews", "method": "POST", "tables": ["product_review"]}
      ]
    },
    {
      "role": "Delivery",
      "color": "#D2BA4C",
      "endpoints": [
        {"path": "/api/delivery/orders", "method": "GET", "tables": ["orders", "customer", "address"]},
        {"path": "/api/delivery/orders/:id/status", "method": "PUT", "tables": ["orders", "delivery_agent"]},
        {"path": "/api/delivery/performance", "method": "GET", "tables": ["orders", "da_review"]},
        {"path": "/api/delivery/availability", "method": "PUT", "tables": ["delivery_agent"]}
      ]
    }
  ],
  "database_tables": [
    {"name": "admin", "type": "user"},
    {"name": "supplier", "type": "user"},
    {"name": "customer", "type": "user"},
    {"name": "delivery_agent", "type": "user"},
    {"name": "product", "type": "core"},
    {"name": "orders", "type": "core"},
    {"name": "cart", "type": "relation"},
    {"name": "order_product", "type": "relation"},
    {"name": "wallet", "type": "utility"},
    {"name": "address", "type": "utility"},
    {"name": "phone_number", "type": "utility"},
    {"name": "product_review", "type": "relation"},
    {"name": "da_review", "type": "relation"}
  ]
}

# Method colors and styles
method_colors = {
    "GET": "#22C55E",
    "POST": "#3B82F6", 
    "PUT": "#F59E0B",
    "DELETE": "#EF4444"
}

method_styles = {
    "GET": "solid",
    "POST": "dash", 
    "PUT": "dot",
    "DELETE": "dashdot"
}

# Create figure
fig = go.Figure()

# Organize endpoints by role with better spacing
endpoint_positions = {}
role_y_starts = {"Admin": 20, "Supplier": 15, "Customer": 9, "Delivery": 3}

for role_data in data["api_endpoints"]:
    role = role_data["role"]
    start_y = role_y_starts[role]
    
    for i, endpoint in enumerate(role_data["endpoints"]):
        endpoint_key = f"{endpoint['path']}_{endpoint['method']}"
        endpoint_positions[endpoint_key] = {
            "x": 1,
            "y": start_y - i * 1.2,
            "role": role,
            "color": role_data["color"],
            "method": endpoint["method"],
            "path": endpoint["path"],
            "tables": endpoint["tables"]
        }

# Organize database tables with strategic positioning to reduce crossings
table_positions = {
    # User tables (top right)
    "admin": {"x": 12, "y": 22, "type": "user"},
    "supplier": {"x": 12, "y": 20.5, "type": "user"},
    "customer": {"x": 12, "y": 19, "type": "user"},
    "delivery_agent": {"x": 12, "y": 17.5, "type": "user"},
    
    # Core tables (middle right)
    "product": {"x": 12, "y": 15, "type": "core"},
    "orders": {"x": 12, "y": 13.5, "type": "core"},
    
    # Relation tables (lower middle right)
    "cart": {"x": 12, "y": 11, "type": "relation"},
    "order_product": {"x": 12, "y": 9.5, "type": "relation"},
    "product_review": {"x": 12, "y": 8, "type": "relation"},
    "da_review": {"x": 12, "y": 6.5, "type": "relation"},
    
    # Utility tables (bottom right)
    "wallet": {"x": 12, "y": 4, "type": "utility"},
    "address": {"x": 12, "y": 2.5, "type": "utility"},
    "phone_number": {"x": 12, "y": 1, "type": "utility"}
}

# Add role headers
for role_data in data["api_endpoints"]:
    role = role_data["role"]
    start_y = role_y_starts[role]
    
    fig.add_trace(go.Scatter(
        x=[0.2],
        y=[start_y + 0.8],
        mode='text',
        text=[role],
        textfont=dict(size=12, color=role_data["color"], family="Arial Black"),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add endpoint nodes with larger, clearer text
for endpoint_key, pos in endpoint_positions.items():
    method_text = pos['method']
    path_parts = pos['path'].split('/')
    endpoint_name = path_parts[-1] if len(path_parts) > 3 else path_parts[-2] if len(path_parts) > 2 else "root"
    display_text = f"{method_text}<br>{endpoint_name[:10]}"
    
    fig.add_trace(go.Scatter(
        x=[pos["x"]],
        y=[pos["y"]],
        mode='markers+text',
        marker=dict(
            size=20,
            color=pos["color"],
            line=dict(width=2, color='white')
        ),
        text=[display_text],
        textposition='middle right',
        textfont=dict(size=10, color='white'),
        showlegend=False,
        hovertemplate=f"<b>{pos['role']}</b><br>{pos['path']}<br><b>{pos['method']}</b><extra></extra>"
    ))

# Add database table nodes with better visibility
table_colors = {"user": "#B4413C", "core": "#964325", "relation": "#944454", "utility": "#13343B"}

for table_name, pos in table_positions.items():
    table_display = table_name.replace('_', '<br>')[:15]
    
    fig.add_trace(go.Scatter(
        x=[pos["x"]],
        y=[pos["y"]],
        mode='markers+text',
        marker=dict(
            size=18,
            color=table_colors[pos["type"]],
            symbol='square',
            line=dict(width=2, color='white')
        ),
        text=[table_display],
        textposition='middle left',
        textfont=dict(size=10, color='white'),
        showlegend=False,
        hovertemplate=f"<b>{table_name}</b><br>Type: {pos['type']}<extra></extra>"
    ))

# Add connections with reduced opacity and different styles
connection_counts = {}
for endpoint_key, endpoint_pos in endpoint_positions.items():
    for table_name in endpoint_pos["tables"]:
        if table_name in table_positions:
            table_pos = table_positions[table_name]
            connection_key = f"{endpoint_pos['y']}_{table_pos['y']}"
            connection_counts[connection_key] = connection_counts.get(connection_key, 0) + 1
            
            # Offset lines to avoid overlap
            offset = connection_counts[connection_key] * 0.1
            
            fig.add_trace(go.Scatter(
                x=[endpoint_pos["x"] + 1.5, table_pos["x"] - 1.5],
                y=[endpoint_pos["y"] + offset, table_pos["y"] + offset],
                mode='lines',
                line=dict(
                    color=method_colors[endpoint_pos["method"]],
                    width=1.5,
                    dash=method_styles[endpoint_pos["method"]]
                ),
                showlegend=False,
                hoverinfo='skip',
                opacity=0.6
            ))

# Add legends with better positioning and larger text
# Method legend
fig.add_trace(go.Scatter(
    x=[7], y=[23], mode='text', text=["HTTP Methods"],
    textfont=dict(size=12, color='black'), showlegend=False, hoverinfo='skip'
))

for i, (method, color) in enumerate(method_colors.items()):
    fig.add_trace(go.Scatter(
        x=[6.5], y=[22 - i * 0.8], mode='lines+text',
        line=dict(color=color, width=3, dash=method_styles[method]),
        text=[f"  {method}"], textposition='middle right',
        textfont=dict(size=11, color=color), showlegend=False, hoverinfo='skip'
    ))

# Table type legend
fig.add_trace(go.Scatter(
    x=[14], y=[23], mode='text', text=["Table Types"],
    textfont=dict(size=12, color='black'), showlegend=False, hoverinfo='skip'
))

for i, (table_type, color) in enumerate(table_colors.items()):
    fig.add_trace(go.Scatter(
        x=[13.5], y=[22 - i * 0.8], mode='markers+text',
        marker=dict(size=12, color=color, symbol='square'),
        text=[f"  {table_type.title()}"], textposition='middle right',
        textfont=dict(size=11, color=color), showlegend=False, hoverinfo='skip'
    ))

# Update layout with better spacing
fig.update_layout(
    title="EBMS API Endpoints & DB Mapping",
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-1, 16]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[0, 25]
    ),
    plot_bgcolor='rgba(248,249,250,0.8)',
    paper_bgcolor='white',
    showlegend=False
)

# Save the chart
fig.write_image("ebms_api_database_mapping.png", width=1600, height=1200, scale=2)