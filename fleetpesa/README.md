# FleetPesa

A fleet remittance and vehicle management platform built for owners running small fleets (10–15 boda bodas / matatus) in Kenya.

## Problem

Fleet owners managing 10–15 vehicles typically track daily remittances, driver performance, and vehicle maintenance across notebooks, M-Pesa statements, and WhatsApp messages. There's no single place to see who paid, who's short, and which vehicle needs service — until something breaks or money goes missing.

FleetPesa gives owners one dashboard to see fleet health at a glance, and gives drivers a fast, one-tap way to log their daily remittance from a phone.

**Target users**
- **Fleet owners** — desktop-first. Need to see revenue, outstanding balances, and maintenance status in under 5 seconds.
- **Drivers** — mobile-first. Need to submit a remittance in as few taps as possible.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (JSX, Vite), React Router |
| Backend | Flask, Flask-JWT-Extended, Flask-Bcrypt |
| ORM / Serialization | SQLAlchemy, Marshmallow |
| Database | SQLite |
| Styling | Tailwind CSS + shadcn/ui components |

## Project Structure

```
fleetpesa/
├── client/     # React frontend
├── server/     # Flask backend + SQLite
└── docs/       # ERD, project pitch
```

See `client/` and `server/` for their own internal structure.

## Features

- Role-based login (Owner / Driver)
- Owner dashboard: fleet revenue, outstanding balances, vehicles due for service, active drivers, fleet performance chart, driver remittance table
- Vehicle detail view: profile, remittance history, maintenance progress
- Driver remittance entry: large numeric input, one-tap submit, confirmation state
- Maintenance alerts sorted by urgency, with "Mark as Serviced" action
- Shortfall detail modal: expected vs. actual comparison, "Flag for Follow-up"
- Full CRUD across two related resources: **Vehicles** ↔ **Remittances**, and **Vehicles** ↔ **Maintenance Records**

## Data Model (summary)

- **User** — id, name, phone, role (`owner` / `driver`), password_hash
- **Vehicle** — id, plate_number, type, owner_id (FK → User), driver_id (FK → User)
- **Remittance** — id, vehicle_id (FK), driver_id (FK), expected_amount, actual_amount, status (`paid`/`late`/`short`), timestamp
- **MaintenanceRecord** — id, vehicle_id (FK), mileage_due, current_mileage, status (`ok`/`due`/`overdue`), last_serviced_at

Full ERD: see `docs/ERD.png`.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new owner or driver account |
| POST | `/auth/login` | Log in, returns JWT |
| GET | `/vehicles` | List all vehicles for the logged-in owner |
| POST | `/vehicles` | Add a vehicle |
| GET | `/vehicles/<id>` | Get one vehicle's details |
| PATCH | `/vehicles/<id>` | Update a vehicle |
| DELETE | `/vehicles/<id>` | Remove a vehicle |
| GET | `/remittances` | List remittances (filterable by vehicle/driver) |
| POST | `/remittances` | Submit a new remittance |
| PATCH | `/remittances/<id>` | Update a remittance (e.g. flag for follow-up) |
| GET | `/maintenance` | List maintenance records, sorted by urgency |
| PATCH | `/maintenance/<id>` | Mark a vehicle as serviced |

All protected routes require an `Authorization: Bearer <token>` header.

## Setup Instructions

### Backend (Flask)

```bash
cd server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade               # create/migrate SQLite DB
python seed.py                 # optional: load sample data
flask run                      # runs on http://localhost:5000
```

### Frontend (React)

```bash
cd client
npm install
cp .env.example .env           # set VITE_API_URL=http://localhost:5000/api
npm run dev                    # runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Use the role toggle on the login screen to sign in as an Owner or a Driver.

## Known Issues / Challenges

- Remittance status thresholds (what counts as "short" vs "late") are currently hardcoded and not yet configurable per owner.
- No real-time updates — the dashboard requires a refresh to reflect a driver's newly submitted remittance.
- Maintenance mileage tracking is manually entered; there's no integration with a vehicle telematics/GPS source.
- Image upload for vehicle photos is not yet implemented (placeholder image used).

## Author

Fredrick