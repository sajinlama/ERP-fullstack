# Supplier Management & Governance Portal

A full-stack supplier onboarding and approval platform built with **React 19, Vite, Express.js, Prisma, PostgreSQL, TypeScript, and Tailwind CSS**.

Suppliers are created by a **Requester** and approved or rejected by a separate **Approver** — no one can approve their own supplier (Four-Eyes Principle).

---

## How It Works

```
REQUESTER creates supplier → DRAFT
        |
        | submit
        v
PENDING_APPROVAL
        |
   +----+----+
   |         |
Approve   Reject
   |         |
   v         v
APPROVED  REJECTED → edit → DRAFT → resubmit
```

A user can never approve a supplier they created themselves.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, TypeScript, Zod
- **Database:** PostgreSQL + Prisma ORM
- **Auth (dev only):** `x-user-id` header

---

## Setup

### 1. Clone

```bash
git clone https://github.com/sajinlama/ERP-fullstack.git
cd supplier-management-portal
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/supplier_db?schema=public"
```

Set up the database:

```bash
npx prisma generate
npx prisma db push
npm run seed
```

Run the backend:

```bash
npm run dev
```

Backend: `http://localhost:5000`
API base: `http://localhost:5000/api/v1`

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

Run the frontend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

---

## Seed Accounts

```
Requester: requester@enterprise.com
Approver:  approver@enterprise.com
```

---

## Roles

| Role | Can |
|---|---|
| **Requester** | Create, edit, submit their own suppliers |
| **Approver** | Approve or reject pending suppliers (not their own) |

---

## API

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/suppliers/getSuppliers
GET    /api/v1/suppliers/my-suppliers
POST   /api/v1/suppliers/createsSuppliers
PUT    /api/v1/suppliers/updateSuppliers
POST   /api/v1/suppliers/:id/submit

POST   /api/v1/approver/approval
POST   /api/v1/approver/reject
```

All authenticated requests require:

```
x-user-id: <USER_UUID>
```

---

## Supplier Statuses

| Status | Meaning |
|---|---|
| `DRAFT` | Being created/edited |
| `PENDING_APPROVAL` | Submitted, awaiting review |
| `APPROVED` | Approved |
| `REJECTED` | Rejected (can be edited and resubmitted) |

---

## Business Rules

1. Only requesters can create suppliers.
2. Only the creator can edit their own supplier.
3. Only `PENDING_APPROVAL` suppliers can be approved/rejected.
4. An approver cannot approve their own supplier.
5. Rejections require a reason.
6. Approved suppliers can't be edited through the normal flow.
7. Every approval/rejection is logged with who, when, and why.

---

## License

MIT
