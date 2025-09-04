
# 📦 E-commerce Business Management System (EBMS)

The **E-commerce Business Management System (EBMS)** is a full-stack application designed to provide a comprehensive dashboard for managing and analyzing e-commerce data.

It features:

* A **Node.js backend API** that connects to a **SQL database**
* A **frontend dashboard** for visualization & interaction
* Support for tracking sales, managing products, and analyzing business performance through metrics & charts

---

## 🚀 Features

* **Backend API**: Built with Node.js & Express to handle CRUD and data operations
* **Database Management**: SQL queries for database generation and data handling
* **Data Visualization**: Interactive dashboard for viewing sales, product stats, and business metrics
* **Modular Structure**: Organized code with controllers, models, routes, and utilities
* **Environment Config**: `.env` file for managing environment variables securely

---

## 🛠️ Technologies Used

* **Backend**: Node.js, Express.js
* **Database**: SQL (MySQL / PostgreSQL)
* **Frontend**: HTML, CSS, JavaScript
* **Data Processing & Charting**: Python

---

## 📂 Folder Structure

```
.
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
```

### Key Folders:

* **ebms-backend-api/** → Backend (Node.js + Express)

  * `controllers/` → Request handling logic
  * `models/` → Database schemas/models
  * `routes/` → API endpoints
  * `server.js` → Entry point for backend

* **Ecommerce-Database-system-.../** → SQL scripts for DB setup & queries

* **exported-assets/** → Frontend dashboard + Python scripts

  * `ebms-dashboard/` → Frontend (HTML, CSS, JS)
  * `chart_script_1.py` → Chart generation
  * `script_1.py` → Data processing

---

## ⚙️ Getting Started

### ✅ Prerequisites

* [Node.js](https://nodejs.org/) + npm
* [Python](https://www.python.org/)
* A running SQL database (MySQL/PostgreSQL)

---

### 🔧 Backend Setup

1. Navigate to backend directory:

   ```bash
   cd ebms-backend-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create `.env` file inside `ebms-backend-api/` and add:

   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=ebms_db
   ```

4. Set up the database:

   * Use SQL scripts from `Ecommerce-Database-system-.../` to create & populate DB

5. Start backend server:

   ```bash
   npm start
   ```

   Your API should run at:
   👉 `http://localhost:3000`

---

### 🎨 Frontend Setup

1. Navigate to:

   ```bash
   cd exported-assets/ebms-dashboard
   ```
2. Open `index.html` in your browser.
3. Ensure `app.js` and `app_1.js` point to your backend API URL.

---

### 📊 Python Scripts

You can run standalone scripts for data processing & charts:

```bash
python chart_script_1.py
```

---

## 📈 Usage

Once backend and frontend are running:

* Open **index.html** in your browser
* Dashboard will fetch data from backend API
* View metrics, charts, and manage your e-commerce business

---

Do you want me to also **add a section for future improvements & contribution guidelines** so that it looks like a polished open-source project README?
