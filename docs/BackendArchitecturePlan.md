# FleetPesa Backend Architecture Plan

Scoped strictly to what the existing frontend (LoginPage, SignupPage, AuthContext, lib/api.js, Dashboard, ShortfallModal) actually calls or expects. No speculative SaaS features (multi-tenant orgs, subscription billing, admin panels, etc.) — those are out of scope.

---

## 1. Data Models

### `User` (`backend/models/user.py`)

Backs login, registration, and driver/owner relationships.

| Field | Type | Notes |
|---|---|---|
| id | Integer, PK | |
| username | String(80), unique, not null | required by SignupPage |
| name | String(120), not null | |
| phone | String(15), unique, not null | Kenyan format, normalized to `+254...` before storage (frontend already normalizes) |
| password_hash | String(255), not null | via Flask-Bcrypt |
| role | String(10), not null | `"owner"` or `"driver"` — matches the role toggle |
| created_at | DateTime, default now | |

**Relationships:**
- `owner.vehicles` — one owner has many vehicles (`Vehicle.owner_id`)
- `driver.vehicle` — one driver is assigned to at most one vehicle at a time (`Vehicle.driver_id`, nullable)

No separate `Driver`/`Owner` tables — a single `User` table with a `role` column matches what the frontend already sends (`role` field on login/register) and avoids overengineering a multi-table user hierarchy the UI doesn't need.

---

### `Vehicle` (`backend/models/vehicle.py`)

Backs the owner's fleet list (add/remove vehicle) and the driver's "my assigned vehicle" view.

| Field | Type | Notes |
|---|---|---|
| id | Integer, PK | |
| plate_number | String(20), unique, not null | |
| vehicle_type | String(20), not null | e.g. `"matatu"` |
| owner_id | FK → User.id, not null | |
| driver_id | FK → User.id, nullable | unassigned vehicles allowed |
| daily_expected_amount | Numeric(10,2), not null | needed for shortfall calculation and the driver's "expected remittance" view |
| is_active | Boolean, default True | supports **remove vehicle** as a soft-delete rather than a hard delete — preserves remittance history integrity (a removed vehicle's past remittances must still be viewable in reports) |
| created_at | DateTime, default now | |

**Why soft-delete for "remove a vehicle":** if an owner removes a vehicle after it has remittance history, hard-deleting it would either cascade-delete valuable remittance records or violate the FK constraint. `is_active=False` lets the vehicle disappear from the active fleet list while remittance history stays intact. List endpoints filter `is_active=True` by default.

---

### `Remittance` (`backend/models/remittance.py`)

Backs remittance history, shortfall detection, and the M-Pesa payment flow.

| Field | Type | Notes |
|---|---|---|
| id | Integer, PK | |
| vehicle_id | FK → Vehicle.id, not null | |
| driver_id | FK → User.id, not null | |
| expected_amount | Numeric(10,2), not null | copied from `Vehicle.daily_expected_amount` at submission time (so later changes to the vehicle's expected amount don't rewrite history) |
| actual_amount | Numeric(10,2), not null | what the driver actually paid |
| status | String(10), not null | `"paid"` / `"short"` — computed server-side, never trusted from the client |
| mpesa_reference | String(50), nullable | FleetPesa-generated reference shown on the receipt |
| mpesa_transaction_code | String(20), nullable | Safaricom's code (e.g. `QAB1XYZ234`), populated once payment confirms |
| payment_status | String(15), not null, default `"pending"` | `"pending"` / `"confirmed"` / `"failed"` — tracks the M-Pesa STK push lifecycle separately from the remittance shortfall status |
| flagged_for_followup | Boolean, default False | Shortfall modal's "Flag for Follow-up" action |
| submitted_at | DateTime, default now | |

**Status computed on the backend, not sent by the client:**
```python
status = "paid" if actual_amount >= expected_amount else "short"
```
This matches the UI's status badges (paid/short) and prevents a client from spoofing a "paid" status.

---

## 2. M-Pesa Payment Flow

The frontend contract says a driver "submits payment through M-Pesa" and "receives a confirmation receipt containing a reference and M-Pesa transaction code." This requires a two-step flow, not a single synchronous POST — M-Pesa STK Push is asynchronous by nature (Safaricom calls back your server after the user enters their PIN on their phone).

### Step 1 — Driver submits remittance (initiates payment)
`POST /api/remittances`
```json
{ "vehicle_id": 3, "amount": 8500 }
```
Backend:
1. Creates a `Remittance` row with `payment_status="pending"`, generates a `mpesa_reference` (e.g. `FP-{remittance_id}`)
2. Calls Safaricom's Daraja STK Push API with the driver's phone number and amount
3. Returns the created remittance (with `payment_status: "pending"`) immediately — the frontend shows a "waiting for M-Pesa confirmation" state

### Step 2 — Safaricom calls back
`POST /api/remittances/mpesa-callback` (webhook, no JWT — validated via Safaricom's own request signature/IP instead)
Backend:
1. Receives the callback payload from Safaricom
2. Matches it to the pending `Remittance` via the reference/CheckoutRequestID
3. Updates `mpesa_transaction_code`, sets `payment_status="confirmed"` (or `"failed"`), computes `status` (paid/short) now that `actual_amount` is confirmed

### Step 3 — Frontend polls or re-fetches
`GET /api/remittances/<id>` — the driver's confirmation screen polls this briefly after submission until `payment_status` flips to `"confirmed"`, then shows the receipt with `mpesa_reference` + `mpesa_transaction_code`.

**Scope note:** for a class project timeline, the Daraja sandbox (not production) is sufficient, and a simulated/mocked callback endpoint is an acceptable fallback if Safaricom sandbox credentials become a blocker — this keeps the same data model and API shape regardless of whether the real integration or a stub is used underneath.

---

## 3. API Endpoints

Base: `http://localhost:5000/api` (matches `VITE_API_URL` already set in frontend `.env`)

### Auth

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/auth/register` | none | `{username, name, phone, password, role}` | `{token, user}` |
| POST | `/auth/login` | none | `{role, phone, password}` | `{token, user}` |

`user` object: `{id, username, name, phone, role}` — matches what `AuthContext.jsx` stores.

### Vehicles (owner fleet management — add/remove)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/vehicles` | owner | List the owner's **active** vehicles (fleet list) |
| POST | `/vehicles` | owner | **Add a vehicle** — `{plate_number, vehicle_type, daily_expected_amount, driver_id?}` |
| GET | `/vehicles/<id>` | owner or assigned driver | Vehicle detail — for the driver's "my assigned vehicle" view too |
| PATCH | `/vehicles/<id>` | owner | Update vehicle (reassign driver, change expected amount) |
| DELETE | `/vehicles/<id>` | owner | **Remove a vehicle** — implemented as `is_active = False`, not a hard delete (see model notes above); returns 204 |

Ownership check on every vehicle route: `vehicle.owner_id == current_user.id`, enforced server-side via the JWT identity — never trust a vehicle ID alone.

### Remittances

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/remittances` | owner or driver | Owner: all remittances for their fleet (filterable by `?vehicle_id=`). Driver: only their own submissions |
| POST | `/remittances` | driver | Submit a remittance — initiates M-Pesa STK push (see flow above) |
| GET | `/remittances/<id>` | owner or driver (own) | Single remittance — used for polling payment confirmation and for the Shortfall Modal's detail view |
| PATCH | `/remittances/<id>` | owner | Flag for follow-up — `{flagged_for_followup: true}` — matches `ShortfallModal.jsx`'s action |
| POST | `/remittances/mpesa-callback` | Safaricom webhook (no JWT) | Daraja callback endpoint |

### Dashboard aggregates (owner)

The Owner Dashboard needs computed numbers, not raw rows — one endpoint avoids the frontend re-deriving totals from a full remittance list client-side:

| Method | Endpoint | Auth | Response |
|---|---|---|---|
| GET | `/dashboard/summary` | owner | `{total_revenue_today, outstanding_balance, active_drivers_count, vehicles_count}` |

This directly backs the Owner Dashboard's stat cards without requiring the frontend to fetch every vehicle and every remittance and compute sums in JavaScript.

---

## 4. Schemas (Marshmallow)

- **`schemas/vehicle_schema.py`** — serializes `Vehicle`, nests a lightweight `driver` summary (`id, name, phone`) so the frontend doesn't need a second fetch to show "assigned driver" on the vehicle detail page
- **`schemas/remittance_schema.py`** — serializes `Remittance`, nests `driver` and `vehicle` summaries for the driver table and shortfall modal, includes `mpesa_reference`/`mpesa_transaction_code` only once `payment_status="confirmed"` (omit/null while pending, since they don't exist yet)

A `user_schema.py` is needed too (not in your current file list) — for serializing the `user` object returned by login/register consistently, and the nested driver summaries above.

---

## 5. Build Order

1. `extensions.py` → `config.py` → `app.py` (app factory, blueprint registration stubs)
2. `models/user.py` → first migration → `routes/auth_routes.py` (unblocks frontend login/signup immediately)
3. `models/vehicle.py` → migration → `schemas/vehicle_schema.py` → `routes/vehicle_routes.py` (unblocks fleet list, add/remove vehicle)
4. `models/remittance.py` → migration → `schemas/remittance_schema.py` → `routes/remittance_routes.py` (without M-Pesa first — accept `actual_amount` directly to unblock shortfall/dashboard UI development)
5. M-Pesa STK push integration + callback endpoint (layer on top of step 4 once the core CRUD is proven working)
6. `/dashboard/summary` aggregate endpoint
7. `seed.py` — sample owner, 2–3 drivers, vehicles, and a mix of paid/short remittances for demo data

Steps 4 (without M-Pesa) and 5 (M-Pesa layered in after) are deliberately split — this lets remittance CRUD, shortfall detection, and the dashboard get built and tested end-to-end before the added complexity and external dependency of Safaricom's sandbox is introduced.