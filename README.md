E-commerce Business Management System (EBMS)DescriptionThe E-commerce Business Management System (EBMS) is a full-stack application designed to provide a comprehensive dashboard for managing and analyzing e-commerce data. It features a Node.js backend API that connects to a SQL database and a frontend dashboard for data visualization and interaction. The system allows for tracking sales, managing products, and gaining insights into business performance through various metrics and charts.FeaturesBackend API: A robust API built with Node.js and Express to handle data operations.Database Management: Includes SQL queries for database generation and management.Data Visualization: A web-based dashboard to visualize key business metrics.Modular Structure: Organized code with separate folders for controllers, models, routes, and utilities.Environment Configuration: Uses a .env file to manage environment variables securely.Technologies UsedBackend: Node.js, Express.jsDatabase: SQL (e.g., MySQL, PostgreSQL)Frontend: HTML, CSS, JavaScriptScripting & Charting: Python (likely for data processing or chart generation)Folder StructureHere is an overview of the main directories and files in this project:.
├── ebms-backend-api/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── Ecommerce-Database-system-.../
│   ├── Database-Generation/
│   ├── Sql Queries/
│   └── README.md
│
└── exported-assets/
    ├── ebms-dashboard/
    │   ├── app_1.js
    │   ├── app.js
    │   ├── index.html
    │   ├── style.css
    │   └── ...
    ├── chart_script_1.py
    ├── script_1.py
    └── ...
ebms-backend-api/: Contains the entire Node.js backend application.controllers/: Logic for handling requests.models/: Database schemas and models.routes/: API endpoint definitions.server.js: The main entry point for the backend server.Ecommerce-Database-system-.../: Contains SQL scripts for database setup and querying.exported-assets/: Contains the frontend dashboard application and Python scripts.ebms-dashboard/: The main frontend application files (HTML, CSS, JS).Getting StartedTo get a local copy up and running, follow these simple steps.PrerequisitesNode.js and npm installed: https://nodejs.org/A running SQL database instance (e.g., MySQL, PostgreSQL).Python installed (for running the Python scripts): https://www.python.org/Backend Installation & SetupNavigate to the backend directory:cd ebms-backend-api
Install NPM packages:npm install
Set up your environment variables:Create a .env file in the ebms-backend-api root.Add the necessary configuration (e.g., database credentials, server port). A env.example file should be created to show the required variables. For example:PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ebms_db
Set up the database:Use the SQL scripts located in the Ecommerce-Database-system-... directory to create and populate your database.Start the backend server:npm start
Your API should now be running on the port you specified (e.g., http://localhost:3000).Frontend SetupOpen the dashboard file:Navigate to the exported-assets/ebms-dashboard/ directory.Open the index.html file in your web browser.Connect to the backend:Ensure the JavaScript files (app.js, app_1.js) are correctly configured to make API requests to your running backend server. You may need to update the base URL for the API calls.UsageOnce both the backend and frontend are running, you can open the index.html page to view the e-commerce dashboard. The dashboard will fetch data from your backend API and display visualizations and metrics about your e-commerce business.The Python scripts (chart_script.py, etc.) can be run independently for specific data processing or chart generation tasks as needed.python chart_script_1.py
Troubleshooting"main and master are entirely different commit histories"If you see this error on GitHub when trying to create a pull request, it means your local master branch and the remote main branch have separate histories. Here is how to fix it using the command line:Fetch the latest from the remote:git fetch origin
Checkout your main branch:git checkout main
(If you don't have one locally, create it: git checkout -b main origin/main)Merge master into main:git merge master --allow-unrelated-histories
Resolve conflicts if any, then add and commit the changes.git add .
git commit -m "feat: Merge master history into main"
Push the updated main branch:git push origin main
(Optional) Delete the old master branch to avoid future confusion:# Delete remote master
git push origin --delete master

# Delete local master
git branch -d master
