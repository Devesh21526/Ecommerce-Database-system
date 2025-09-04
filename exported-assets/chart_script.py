import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np

# Define the layers and components with detailed information
layers_data = {
    'Frontend Layer': {
        'components': [
            {'name': 'Admin Dashboard', 'short': 'Admin', 'features': 'Analytics, User Mgmt, Order Track'},
            {'name': 'Supplier Dashboard', 'short': 'Supplier', 'features': 'Product Mgmt, Sales, Inventory'},
            {'name': 'Customer Dashboard', 'short': 'Customer', 'features': 'Catalog, Cart, History'},
            {'name': 'Delivery Dashboard', 'short': 'Delivery', 'features': 'Route Track, Performance'}
        ],
        'y_level': 3,
        'color': '#1FB8CD',
        'tech': 'React, Next.js, TypeScript, Tailwind'
    },
    'Backend API Layer': {
        'components': [
            {'name': 'Authentication', 'short': 'Auth', 'features': 'JWT, Role Access, Login'},
            {'name': 'Controllers', 'short': 'Controllers', 'features': 'Admin, Supplier, Customer'},
            {'name': 'Middleware', 'short': 'Middleware', 'features': 'Auth Verify, Role Check'},
            {'name': 'Routes', 'short': 'API Routes', 'features': 'RESTful, CRUD, Error Handle'}
        ],
        'y_level': 2,
        'color': '#DB4545',
        'tech': 'Node.js, Express.js, JWT, bcrypt'
    },
    'Database Layer': {
        'components': [
            {'name': 'User Tables', 'short': 'Users', 'features': 'admin, supplier, customer'},
            {'name': 'Core Tables', 'short': 'Core', 'features': 'product, orders, cart'},
            {'name': 'Utility Tables', 'short': 'Utilities', 'features': 'address, reviews, phone'},
            {'name': 'Relations', 'short': 'Relations', 'features': 'order_product joins'}
        ],
        'y_level': 1,
        'color': '#2E8B57',
        'tech': 'MySQL, Triggers, Indexes, Pooling'
    }
}

# Create figure
fig = go.Figure()

# Add components for each layer
all_components = []
component_positions = {}

for layer_name, layer_info in layers_data.items():
    components = layer_info['components']
    y_level = layer_info['y_level']
    color = layer_info['color']
    
    # Position components horizontally with more spacing
    x_positions = np.linspace(1.5, 8.5, len(components))
    
    for i, component in enumerate(components):
        x_pos = x_positions[i]
        component_positions[component['name']] = (x_pos, y_level)
        all_components.append({
            'component': component['name'],
            'short_name': component['short'],
            'features': component['features'],
            'layer': layer_name,
            'x': x_pos,
            'y': y_level,
            'color': color
        })

# Convert to DataFrame for easier handling
df_components = pd.DataFrame(all_components)

# Add scatter points for components with larger markers
for layer_name, layer_info in layers_data.items():
    layer_components = df_components[df_components['layer'] == layer_name]
    
    fig.add_trace(go.Scatter(
        x=layer_components['x'],
        y=layer_components['y'],
        mode='markers+text',
        marker=dict(
            size=50,  # Increased size
            color=layer_info['color'],
            line=dict(width=3, color='white'),
            symbol='circle'
        ),
        text=layer_components['short_name'],
        textposition='middle center',
        textfont=dict(size=11, color='white', family='Arial Black'),
        name=layer_name,
        hovertemplate='<b>%{customdata[0]}</b><br>' +
                     'Features: %{customdata[1]}<br>' +
                     'Layer: ' + layer_name + '<br>' +
                     'Tech: ' + layer_info['tech'] + '<extra></extra>',
        customdata=layer_components[['component', 'features']].values,
        showlegend=True
    ))

# Define connections with better routing
connections = [
    # Frontend to Backend connections
    ('Admin Dashboard', 'Authentication', 'auth'),
    ('Admin Dashboard', 'Controllers', 'direct'),
    ('Supplier Dashboard', 'Controllers', 'direct'),
    ('Customer Dashboard', 'Controllers', 'direct'),
    ('Delivery Dashboard', 'Controllers', 'direct'),
    
    # Backend internal connections
    ('Authentication', 'Middleware', 'internal'),
    ('Middleware', 'Routes', 'internal'),
    ('Controllers', 'Routes', 'internal'),
    
    # Backend to Database connections
    ('Routes', 'User Tables', 'data'),
    ('Routes', 'Core Tables', 'data'),
    ('Routes', 'Utility Tables', 'data'),
    ('Routes', 'Relations', 'data')
]

# Add connection lines with curved paths to avoid intersections
for start_comp, end_comp, conn_type in connections:
    if start_comp in component_positions and end_comp in component_positions:
        start_pos = component_positions[start_comp]
        end_pos = component_positions[end_comp]
        
        # Create curved path for better visual separation
        if conn_type == 'auth':
            line_color = '#FFD700'  # Gold for auth connections
            line_width = 3
            dash_style = 'dot'
        elif conn_type == 'internal':
            line_color = '#FF6B6B'  # Light red for internal
            line_width = 2
            dash_style = 'dash'
        elif conn_type == 'data':
            line_color = '#4ECDC4'  # Teal for data connections
            line_width = 2
            dash_style = 'solid'
        else:
            line_color = '#95A5A6'  # Gray for others
            line_width = 2
            dash_style = 'solid'
        
        # Add curved line using bezier-like approach
        mid_x = (start_pos[0] + end_pos[0]) / 2
        mid_y = (start_pos[1] + end_pos[1]) / 2
        
        # Create control points for curve
        if abs(start_pos[0] - end_pos[0]) > 2:  # Wide spacing, add curve
            control_y = mid_y + 0.15 * (start_pos[1] - end_pos[1])
            x_points = [start_pos[0], mid_x, end_pos[0]]
            y_points = [start_pos[1], control_y, end_pos[1]]
        else:
            x_points = [start_pos[0], end_pos[0]]
            y_points = [start_pos[1], end_pos[1]]
        
        fig.add_trace(go.Scatter(
            x=x_points,
            y=y_points,
            mode='lines',
            line=dict(
                color=line_color,
                width=line_width,
                dash=dash_style
            ),
            showlegend=False,
            hoverinfo='skip'
        ))

# Add layer background rectangles
for layer_name, layer_info in layers_data.items():
    y_level = layer_info['y_level']
    fig.add_shape(
        type="rect",
        x0=0.8, y0=y_level-0.3,
        x1=9.2, y1=y_level+0.3,
        fillcolor=layer_info['color'],
        opacity=0.1,
        line=dict(color=layer_info['color'], width=2, dash='dash')
    )

# Update layout
fig.update_layout(
    title='EBMS System Architecture',
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[0, 10]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[0.4, 3.6]
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.02,
        xanchor='center',
        x=0.5
    ),
    height=650
)

# Add layer labels with technology stack
fig.add_annotation(
    x=0.2, y=3, 
    text="<b>Frontend</b><br>React, Next.js<br>TypeScript", 
    showarrow=False, 
    font=dict(size=12, color='#1FB8CD'),
    bgcolor='rgba(255,255,255,0.8)',
    bordercolor='#1FB8CD',
    borderwidth=1
)

fig.add_annotation(
    x=0.2, y=2, 
    text="<b>Backend API</b><br>Node.js<br>Express, JWT", 
    showarrow=False, 
    font=dict(size=12, color='#DB4545'),
    bgcolor='rgba(255,255,255,0.8)',
    bordercolor='#DB4545',
    borderwidth=1
)

fig.add_annotation(
    x=0.2, y=1, 
    text="<b>Database</b><br>MySQL<br>Triggers, Indexes", 
    showarrow=False, 
    font=dict(size=12, color='#2E8B57'),
    bgcolor='rgba(255,255,255,0.8)',
    bordercolor='#2E8B57',
    borderwidth=1
)

# Add data flow legend
fig.add_annotation(
    x=9.5, y=3.4,
    text="<b>Data Flow Types:</b><br>━━━ Direct API<br>┅┅┅ Authentication<br>▬▬▬ Internal<br>━━━ Database",
    showarrow=False,
    font=dict(size=10),
    bgcolor='rgba(245,245,245,0.9)',
    bordercolor='gray',
    borderwidth=1,
    align='left'
)

# Save the chart
fig.write_image("ebms_architecture_improved.png", width=1400, height=650, scale=2)

print("Improved EBMS System Architecture diagram saved as ebms_architecture_improved.png")