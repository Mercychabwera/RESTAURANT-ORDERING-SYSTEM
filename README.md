# Restaurant Ordering Web-Based System

This project contains a React frontend and Django REST API backend for a restaurant ordering system using Malawi Kwacha prices. It uses Django's built-in SQLite database file, so you do not need MySQL.

## Features

- Login page for staff access
- Menu management page with 20+ meals and prices in Malawi Kwacha
- Order placement page with cart and totals
- Kitchen dashboard for order status updates
- Billing system for cash, card, and mobile money payments
- Sales report page with total sales, paid orders, open bills, and popular meals

## Project Structure

```text
restaurant-ordering-system/
  backend/       Django backend API
  frontend/      React frontend
```

## Step 1: Open the project in VS Code

1. Open VS Code.
2. Click **File > Open Folder**.
3. Select this folder:

```text
C:\Users\mercy\Documents\Codex\2026-06-02\create-a-restaurant-ordering-web-based\outputs\restaurant-ordering-system
```

## Step 2: Run the Django backend

In VS Code, open a terminal and run:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Then run:

```powershell
python manage.py migrate
python manage.py seed_menu
python manage.py createsuperuser
python manage.py runserver
```

If you already ran the project before pictures were added, run these again inside `backend`:

```powershell
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py seed_menu
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Useful backend links:

```text
http://127.0.0.1:8000/api/health/
http://127.0.0.1:8000/admin/
http://127.0.0.1:8000/api/menu-items/
http://127.0.0.1:8000/api/orders/
http://127.0.0.1:8000/api/bills/
http://127.0.0.1:8000/api/sales-report/
```

## Step 3: Run the React frontend

Open a second VS Code terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

If PowerShell says `npm.ps1 cannot be loaded because running scripts is disabled`, use these commands instead:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

The frontend will run at:

```text
http://localhost:5173
```

The React frontend connects to the Django backend API here:

```text
http://127.0.0.1:8000/api
```

When the frontend is connected correctly, the top of the page will show **API Connected**. If it shows **API Offline**, make sure the Django backend terminal is still running.

## Using an online backend API

The frontend can connect to an online Django API after you deploy the backend to a hosting service such as Render, Railway, PythonAnywhere, or your school server.

In the `frontend` folder, create a file named `.env`:

```powershell
copy .env.example .env
```

Then put your online backend API URL inside it:

```text
VITE_API_BASE_URL=https://your-online-backend-domain.com/api
```

After changing `.env`, restart the React frontend:

```powershell
npm.cmd run dev
```

Keep using the local URL until your Django backend has actually been deployed online:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Step 4: Login and test the system

Use these demo login details on the React login page:

```text
Username: admin
Password: admin123
```

Then test the process:

1. Open **Menu** and confirm the Malawi Kwacha meals are listed.
2. Open **Orders**, choose meals, enter customer name and table number, then place an order.
3. Open **Kitchen** and move the order from placed to preparing, ready, then served.
4. Open **Billing** and mark the bill paid by cash or mobile money.
5. Open **Reports** and refresh to see sales totals.

## Notes

- The React app shows a demo menu if the Django backend is not running.
- Real saving, billing, kitchen status, and reports need the Django backend running.
- Django will automatically create a local database file named `db.sqlite3` when you run `python manage.py migrate`.
- Prices are stored as `price_mwk` in the database.
