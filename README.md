Absolutely — here is the entire README.md as one single file. Copy everything below into a file named README.md.

# Supplier Management & Governance Portal (ERP)

A production-grade, full-stack **Supplier Onboarding and Lifecycle Governance platform** built with **React 19, Vite, Express.js, Prisma ORM, PostgreSQL, TypeScript, and Tailwind CSS**.

The platform manages the complete supplier lifecycle while enforcing role-based authorization, separation of duties, the Four-Eyes Principle, and an auditable approval process.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Four-Eyes Principle](#four-eyes-principle)
- [Supplier Lifecycle](#supplier-lifecycle)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Seed Data](#seed-data)
- [Running the Application](#running-the-application)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [API Reference](#api-reference)
- [Authentication Endpoints](#authentication-endpoints)
- [Supplier Endpoints](#supplier-endpoints)
- [Approver Endpoints](#approver-endpoints)
- [Status Transitions](#status-transitions)
- [Business Rules](#business-rules)
- [Audit Trail](#audit-trail)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Security Checklist](#security-checklist)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)

---

# Overview

The **Supplier Management & Governance Portal** is an ERP-style application designed to manage supplier onboarding and supplier lifecycle governance.

The system separates supplier creation from supplier approval.

A requester creates and submits a supplier, while a separate authorized approver reviews and approves or rejects the supplier.

This prevents self-approval and provides an auditable governance process.

---

# Features

## Supplier Management

- Create suppliers
- Edit suppliers
- View all suppliers
- View own suppliers
- Submit suppliers for approval
- Resubmit rejected suppliers
- Track supplier status
- Manage supplier contact information
- Manage VAT/tax identification information

## Approval Management

- Dedicated approver workflow
- Approve supplier applications
- Reject supplier applications
- Mandatory rejection reason
- Approval history
- Rejection history
- Separation of duties
- Self-approval prevention

## Governance

- Four-Eyes Principle
- Role-based authorization
- Backend authorization
- Controlled status transitions
- Audit records
- Timestamped decisions
- User identification for every decision

---

# Architecture

```text
+-------------------------------------------------------+
|                    FRONTEND                           |
|                                                       |
| React 19 + TypeScript + Vite                         |
| Tailwind CSS + Axios + React Router                  |
+---------------------------+---------------------------+
                            |
                            | HTTP / JSON
                            v
+-------------------------------------------------------+
|                     BACKEND                           |
|                                                       |
| Node.js + Express.js + TypeScript                    |
| Zod Validation                                       |
| Authentication Middleware                            |
| Authorization Middleware                             |
| Supplier Controllers                                 |
| Approver Controllers                                 |
+---------------------------+---------------------------+
                            |
                            | Prisma ORM
                            v
+-------------------------------------------------------+
|                   POSTGRESQL                          |
|                                                       |
| User                                                 |
| Supplier                                             |
| ApprovalRecord                                       |
+-------------------------------------------------------+
```

---

# Four-Eyes Principle

The application enforces separation of duties.

A user who creates a supplier cannot approve that same supplier.

## Invalid Workflow

```text
Requester A
     |
     | Creates supplier
     v
Supplier
     |
     | Attempts approval
     v
Requester A
     |
     X
DENIED
```

## Valid Workflow

```text
Requester A
     |
     | Creates supplier
     v
Supplier
     |
     | Submit
     v
Pending Approval
     |
     | Review
     v
Approver B
     |
     | Approve
     v
Approved
```

The backend enforces:

```text
supplier.createdById !== approver.id
```

---

# Supplier Lifecycle

```text
                    +-----------+
                    |   DRAFT   |
                    +-----+-----+
                          |
                          | Submit
                          v
              +------------------------+
              |   PENDING_APPROVAL     |
              +----------+-------------+
                         |
                 +-------+-------+
                 |               |
              Approve          Reject
                 |               |
                 v               v
           +-----------+    +-----------+
           | APPROVED  |    | REJECTED  |
           +-----------+    +-----+-----+
                                  |
                                  | Edit
                                  v
                            +-----------+
                            |   DRAFT   |
                            +-----+-----+
                                  |
                                  | Submit
                                  v
                       PENDING_APPROVAL
```

---

# Supplier Statuses

| Status | Description |
|---|---|
| `DRAFT` | Supplier is being created or edited |
| `PENDING_APPROVAL` | Supplier has been submitted and is waiting for approval |
| `APPROVED` | Supplier has been approved |
| `REJECTED` | Supplier has been rejected |

---

# Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router 7

## Backend

- Node.js
- Express.js
- TypeScript
- ES Modules
- Zod
- Async/Await

## Database

- PostgreSQL
- Prisma ORM

## Authentication

Development authentication uses:

```http
x-user-id: <USER_UUID>
```

The backend looks up the user from PostgreSQL and determines the user's role.

> For production, replace the development header-based authentication with a secure authentication system such as OAuth/OIDC, JWT, enterprise SSO, or secure server-side sessions.

---

# Project Structure

```text
supplier-management-portal/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── supplier.controller.ts
│   │   │   └── approver.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── approver.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── supplier.routes.ts
│   │   │   └── approver.routes.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   └── supplier.validator.ts
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── routes/
│   │   └── main.tsx
│   │
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# Prerequisites

Install the following before running the application:

- Node.js 18 or newer
- npm
- PostgreSQL
- Git

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check PostgreSQL:

```bash
psql --version
```

---

# Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd supplier-management-portal
```

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/supplier_db?schema=public"
```

Change the PostgreSQL username and password to match your environment.

---

# Database Setup

Create the PostgreSQL database.

Using PostgreSQL:

```sql
CREATE DATABASE supplier_db;
```

Then generate the Prisma client:

```bash
npx prisma generate
```

Push the Prisma schema:

```bash
npx prisma db push
```

For migration-based environments:

```bash
npx prisma migrate dev
```

---

# Prisma Studio

To inspect the database visually:

```bash
npx prisma studio
```

Prisma Studio allows you to inspect:

- Users
- Suppliers
- Supplier statuses
- Approval records
- Rejection reasons
- Timestamps

---

# Seed Data

The project provides development accounts.

Run:

```bash
npm run seed
```

Example accounts:

```text
REQUESTER
Email: requester@enterprise.com

APPROVER
Email: approver@enterprise.com
```

The seed script creates UUIDs automatically.

> Do not use development seed accounts in production.

---

# Running the Application

## Start Backend

From:

```text
backend/
```

Run:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api/v1
```

---

# Frontend Setup

Open a new terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# Frontend Environment Variables

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

---

# Start Frontend

Run:

```bash
npm run dev
```

Vite will normally start at:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

---

# Authentication

The development API uses the following header:

```http
x-user-id: <USER_UUID>
```

Example:

```http
x-user-id: 3f42...-uuid
```

The backend uses this UUID to retrieve the user.

Example response:

```json
{
  "success": true,
  "user": {
    "id": "3f42...-uuid",
    "name": "Alex Reed",
    "email": "alex.reed@enterprise.com",
    "role": "REQUESTER"
  }
}
```

---

# User Roles

## REQUESTER

A requester can:

- Create suppliers
- Edit suppliers
- View own suppliers
- Submit suppliers
- Resubmit rejected suppliers

A requester cannot:

- Approve suppliers
- Reject suppliers
- Approve their own supplier

---

## APPROVER

An approver can:

- View suppliers
- Review pending suppliers
- Approve suppliers
- Reject suppliers
- Provide rejection reasons

An approver cannot approve a supplier that they created themselves.

---

# API Reference

Base URL:

```text
/api/v1
```

Local:

```text
http://localhost:5000/api/v1
```

---

# Authentication Endpoints

## Register

```http
POST /auth/register
```

Authentication:

```text
Not required
```

Request:

```json
{
  "name": "Alex Reed",
  "email": "alex.reed@enterprise.com",
  "role": "REQUESTER"
}
```

Supported roles:

```text
REQUESTER
APPROVER
```

Example:

```bash
curl -X POST \
  http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Reed",
    "email": "alex.reed@enterprise.com",
    "role": "REQUESTER"
  }'
```

---

# Login

```http
POST /auth/login
```

Authentication:

```text
Not required
```

Request:

```json
{
  "email": "alex.reed@enterprise.com"
}
```

Example:

```bash
curl -X POST \
  http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.reed@enterprise.com"
  }'
```

Example response:

```json
{
  "success": true,
  "user": {
    "id": "3f42...-uuid",
    "name": "Alex Reed",
    "email": "alex.reed@enterprise.com",
    "role": "REQUESTER"
  }
}
```

---

# Supplier Endpoints

## Get All Suppliers

```http
GET /suppliers/getSuppliers
```

Header:

```http
x-user-id: <USER_UUID>
```

Example:

```bash
curl \
  http://localhost:5000/api/v1/suppliers/getSuppliers \
  -H "x-user-id: <USER_UUID>"
```

---

# Get My Suppliers

```http
GET /suppliers/my-suppliers
```

Header:

```http
x-user-id: <REQUESTER_UUID>
```

Example:

```bash
curl \
  http://localhost:5000/api/v1/suppliers/my-suppliers \
  -H "x-user-id: <REQUESTER_UUID>"
```

---

# Create Supplier

```http
POST /suppliers/createsSuppliers
```

Header:

```http
x-user-id: <REQUESTER_UUID>
```

Request:

```json
{
  "companyName": "Acme Logistics Ltd",
  "vatId": "VAT-1029384",
  "country": "GERMANY",
  "contactEmail": "contact@acme.de",
  "createdById": "3f42...-uuid"
}
```

Example:

```bash
curl -X POST \
  http://localhost:5000/api/v1/suppliers/createsSuppliers \
  -H "Content-Type: application/json" \
  -H "x-user-id: <REQUESTER_UUID>" \
  -d '{
    "companyName": "Acme Logistics Ltd",
    "vatId": "VAT-1029384",
    "country": "GERMANY",
    "contactEmail": "contact@acme.de",
    "createdById": "<REQUESTER_UUID>"
  }'
```

New suppliers start with:

```text
DRAFT
```

---

# Update Supplier

```http
PUT /suppliers/updateSuppliers
```

Header:

```http
x-user-id: <REQUESTER_UUID>
```

Request:

```json
{
  "supplierId": "e28a...-uuid",
  "companyName": "Acme Logistics GmbH",
  "vatId": "VAT-1029384",
  "country": "GERMANY",
  "contactEmail": "contact@acme.de"
}
```

Only the supplier creator can update the supplier.

Approved suppliers cannot be modified through this endpoint.

---

# Submit Supplier

```http
POST /suppliers/:id/submit
```

Header:

```http
x-user-id: <REQUESTER_UUID>
```

Example:

```bash
curl -X POST \
  http://localhost:5000/api/v1/suppliers/<SUPPLIER_UUID>/submit \
  -H "x-user-id: <REQUESTER_UUID>"
```

Status changes:

```text
DRAFT
    |
    | Submit
    v
PENDING_APPROVAL
```

Rejected suppliers can be edited and submitted again.

---

# Approver Endpoints

All approver endpoints require:

```text
x-user-id: <APPROVER_UUID>
```

The authenticated user must have:

```text
APPROVER
```

role.

---

# Approve Supplier

```http
POST /approver/approval
```

Request:

```json
{
  "supplierId": "e28a...-uuid"
}
```

Example:

```bash
curl -X POST \
  http://localhost:5000/api/v1/approver/approval \
  -H "Content-Type: application/json" \
  -H "x-user-id: <APPROVER_UUID>" \
  -d '{
    "supplierId": "<SUPPLIER_UUID>"
  }'
```

The backend verifies:

1. The user exists.
2. The user is an `APPROVER`.
3. The supplier exists.
4. The supplier is `PENDING_APPROVAL`.
5. The approver is not the supplier creator.
6. An approval audit record is created.
7. The supplier becomes `APPROVED`.

---

# Reject Supplier

```http
POST /approver/reject
```

Request:

```json
{
  "supplierId": "e28a...-uuid",
  "rejectionReason": "Missing valid tax compliance certificate and EU VAT registration proof."
}
```

Example:

```bash
curl -X POST \
  http://localhost:5000/api/v1/approver/reject \
  -H "Content-Type: application/json" \
  -H "x-user-id: <APPROVER_UUID>" \
  -d '{
    "supplierId": "<SUPPLIER_UUID>",
    "rejectionReason": "Missing valid tax compliance certificate and EU VAT registration proof."
  }'
```

The rejection reason is mandatory.

Status becomes:

```text
REJECTED
```

---

# API Summary

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login |
| GET | `/suppliers/getSuppliers` | Authenticated | Get all suppliers |
| GET | `/suppliers/my-suppliers` | Authenticated | Get own suppliers |
| POST | `/suppliers/createsSuppliers` | Requester | Create supplier |
| PUT | `/suppliers/updateSuppliers` | Requester | Update supplier |
| POST | `/suppliers/:id/submit` | Requester | Submit supplier |
| POST | `/approver/approval` | Approver | Approve supplier |
| POST | `/approver/reject` | Approver | Reject supplier |

---

# Status Transitions

Allowed transitions:

| Current | Action | Next |
|---|---|---|
| `DRAFT` | Submit | `PENDING_APPROVAL` |
| `PENDING_APPROVAL` | Approve | `APPROVED` |
| `PENDING_APPROVAL` | Reject | `REJECTED` |
| `REJECTED` | Edit | `DRAFT` |
| `DRAFT` | Resubmit | `PENDING_APPROVAL` |

Invalid transitions must be rejected by the backend.

---

# Business Rules

## Rule 1

Only requesters can create suppliers.

```text
REQUESTER -> CREATE -> SUPPLIER
```

---

## Rule 2

Only the supplier creator can edit their supplier.

```text
Creator == Authenticated User
```

---

## Rule 3

Only pending suppliers can be approved.

```text
PENDING_APPROVAL -> APPROVED
```

---

## Rule 4

Only pending suppliers can be rejected.

```text
PENDING_APPROVAL -> REJECTED
```

---

## Rule 5

A requester cannot approve their own supplier.

```text
supplier.createdById !== approver.id
```

---

## Rule 6

A rejection requires a reason.

Example:

```json
{
  "supplierId": "uuid",
  "rejectionReason": "Missing compliance documentation."
}
```

---

## Rule 7

Approved suppliers cannot be modified through the normal requester workflow.

---

## Rule 8

Every approval and rejection creates an audit record.

---

# Audit Trail

Every governance decision creates an `ApprovalRecord`.

The record contains:

```text
id
supplierId
approverId
decision
rejectionReason
createdAt
```

Example:

```json
{
  "supplierId": "e28a...-uuid",
  "approverId": "9a91...-uuid",
  "decision": "REJECTED",
  "rejectionReason": "Missing tax compliance certificate.",
  "createdAt": "2026-08-18T12:30:00.000Z"
}
```

This provides traceability for:

- Who approved the supplier
- Who rejected the supplier
- When the decision occurred
- Which supplier was affected
- Why the supplier was rejected

---

# Database Model

The database contains three primary entities.

## User

```text
User
├── id
├── name
├── email
├── role
├── createdAt
└── updatedAt
```

Roles:

```text
REQUESTER
APPROVER
```

---

## Supplier

```text
Supplier
├── id
├── companyName
├── vatId
├── country
├── contactEmail
├── status
├── createdById
├── createdAt
└── updatedAt
```

---

## ApprovalRecord

```text
ApprovalRecord
├── id
├── supplierId
├── approverId
├── decision
├── rejectionReason
└── createdAt
```

---

# Database Relationship

```text
USER
 |
 | creates
 v
SUPPLIER
 |
 | reviewed by
 v
APPROVAL_RECORD
 |
 | approved/rejected by
 v
USER
```

---

# Validation

Zod is used to validate incoming requests.

Validation is applied to:

- Registration
- Login
- Supplier creation
- Supplier updates
- Supplier approval
- Supplier rejection

Examples of invalid input:

```text
Invalid email
Missing company name
Missing VAT ID
Invalid UUID
Missing country
Missing contact email
Missing rejection reason
```

---

# HTTP Status Codes

| Code | Meaning |
|---:|---|
| `200` | Successful request |
| `201` | Resource created |
| `400` | Invalid request |
| `401` | Authentication required |
| `403` | Permission denied |
| `404` | Resource not found |
| `409` | Business rule/state conflict |
| `422` | Validation error |
| `500` | Internal server error |

Example:

```json
{
  "success": false,
  "message": "A requester cannot approve their own supplier"
}
```

---

# Testing

Run backend tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

---

# Recommended Test Cases

## Authentication Tests

- Register requester
- Register approver
- Reject invalid email
- Reject duplicate email
- Login existing user
- Reject unknown user

## Supplier Tests

- Create supplier
- Retrieve all suppliers
- Retrieve own suppliers
- Update supplier
- Prevent unauthorized updates
- Prevent editing approved suppliers

## Approval Tests

- Approver can approve supplier
- Requester cannot approve supplier
- Creator cannot approve their own supplier
- Only pending suppliers can be approved

## Rejection Tests

- Approver can reject supplier
- Rejection reason is mandatory
- Requester cannot reject supplier
- Only pending suppliers can be rejected

## Lifecycle Tests

Valid:

```text
DRAFT
  ↓
PENDING_APPROVAL
  ↓
APPROVED
```

Valid rejection flow:

```text
DRAFT
  ↓
PENDING_APPROVAL
  ↓
REJECTED
  ↓
DRAFT
  ↓
PENDING_APPROVAL
```

---

# Complete Example Workflow

## 1. Requester Login

```text
Email:
requester@enterprise.com

Role:
REQUESTER
```

---

## 2. Create Supplier

```text
Company:
Acme Logistics Ltd

VAT ID:
VAT-1029384

Country:
GERMANY

Contact:
contact@acme.de
```

Initial status:

```text
DRAFT
```

---

## 3. Submit Supplier

Requester submits the supplier.

Status:

```text
PENDING_APPROVAL
```

---

## 4. Approver Login

```text
Email:
approver@enterprise.com

Role:
APPROVER
```

---

## 5. Approve

Approver reviews the supplier and approves it.

Status:

```text
APPROVED
```

An audit record is created.

---

# Rejection Workflow

Instead of approving:

```text
PENDING_APPROVAL
        |
        v
     REJECTED
```

Example rejection:

```text
Missing valid tax compliance certificate.
```

The requester can then:

```text
REJECTED
    |
    | Edit
    v
DRAFT
    |
    | Submit
    v
PENDING_APPROVAL
```

The supplier can then be reviewed again.

---

# Production Deployment

Before production deployment, replace the development authentication mechanism.

Recommended options:

- OAuth 2.0
- OpenID Connect
- JWT
- Enterprise SSO
- Secure server-side sessions
- MFA

Do not rely on a client-controlled `x-user-id` header as the sole authentication mechanism in production.

---

# Production Database

Use a secure PostgreSQL instance.

Example:

```env
DATABASE_URL="postgresql://production-user:password@production-host:5432/supplier_db"
```

Never commit production credentials to Git.

---

# Production Prisma Commands

Generate Prisma client:

```bash
npx prisma generate
```

Deploy migrations:

```bash
npx prisma migrate deploy
```

---

# Production Security Checklist

- [ ] Use HTTPS
- [ ] Replace header-based authentication
- [ ] Implement secure authentication
- [ ] Implement role-based authorization
- [ ] Restrict CORS
- [ ] Validate all request data
- [ ] Prevent self-approval
- [ ] Validate status transitions
- [ ] Protect environment variables
- [ ] Add rate limiting
- [ ] Add security headers
- [ ] Add structured logging
- [ ] Avoid exposing stack traces
- [ ] Back up PostgreSQL
- [ ] Test database restoration
- [ ] Monitor errors
- [ ] Protect audit records
- [ ] Regularly update dependencies

---

# Troubleshooting

## PostgreSQL Connection Error

Check:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/supplier_db?schema=public"
```

Verify PostgreSQL is running.

Then run:

```bash
npx prisma db push
```

---

## Prisma Client Error

Run:

```bash
npx prisma generate
```

---

## Port Already in Use

Change:

```env
PORT=5000
```

to:

```env
PORT=5001
```

Then update:

```env
VITE_API_BASE_URL="http://localhost:5001/api/v1"
```

Restart both applications.

---

## Frontend Cannot Reach Backend

Verify backend:

```text
http://localhost:5000
```

Verify frontend:

```env
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

Restart Vite after modifying `.env`.

---

## Approval Returns 403

Check that the authenticated user has:

```text
role = APPROVER
```

and that the request contains:

```http
x-user-id: <APPROVER_UUID>
```

Also verify that the approver is not the supplier creator.

---

## Approval Returns 409

Check that the supplier status is:

```text
PENDING_APPROVAL
```

Only pending suppliers can be approved.

---

# Future Improvements

Potential enhancements include:

## Authentication

- Enterprise SSO
- OAuth/OIDC
- MFA
- Password reset
- Session management

## Supplier Management

- Supplier documents
- Tax certificates
- Bank verification
- Compliance questionnaires
- Supplier risk scoring
- Supplier performance management
- Supplier contracts

## Governance

- Multi-level approvals
- Approval delegation
- Approval escalation
- Approval deadlines
- Risk-based approval workflows
- Automated compliance checks

## Notifications

- Email notifications
- Approval reminders
- Rejection notifications
- Resubmission notifications

## Reporting

- Supplier dashboards
- Approval metrics
- Rejection statistics
- Compliance reports
- Risk reports
- Audit reports

---

# API Quick Reference

```text
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

---

# Quick Start

```bash
# Clone
git clone https://github.com/sajinlama/ERP-fullstack.git

# Backend
cd supplier-management-portal/backend

# Install
npm install

# Prisma
npx prisma generate
npx prisma db push

# Seed
npm run seed

# Start backend
npm run dev
```

In another terminal:

```bash
# Frontend
cd supplier-management-portal/frontend

# Install
npm install

# Start frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

API:

```text
http://localhost:5000/api/v1
```

---

# Final Workflow

```text
                         SUPPLIER PORTAL
                                |
                                v
                         +-------------+
                         |  REQUESTER  |
                         +------+------+
                                |
                                | Create
                                v
                         +-------------+
                         |    DRAFT    |
                         +------+------+
                                |
                                | Submit
                                v
                    +------------------------+
                    |   PENDING_APPROVAL     |
                    +-----------+------------+
                                |
                    +-----------+-----------+
                    |                       |
                 Approve                  Reject
                    |                       |
                    v                       v
             +-------------+         +-------------+
             |  APPROVED   |         |  REJECTED   |
             +-------------+         +------+------+
                                            |
                                            | Edit
                                            v
                                      +-----------+
                                      |   DRAFT   |
                                      +-----+-----+
                                            |
                                            | Submit
                                            v
                                  PENDING_APPROVAL
```

---

# Conclusion

The Supplier Management & Governance Portal provides a controlled and auditable supplier lifecycle.

The core governance model is:

```text
REQUESTER
    |
    | Create / Edit
    v
SUPPLIER
    |
    | Submit
    v
PENDING_APPROVAL
    |
    v
APPROVER
    |
    +-------------------+
    |                   |
  Approve             Reject
    |                   |
    v                   v
APPROVED             REJECTED
                        |
                        | Edit & Resubmit
                        v
                 PENDING_APPROVAL
```

The system is built around:

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router 7
- Node.js
- Express.js
- Prisma
- PostgreSQL
- Zod
- Role-based authorization
- Four-Eyes Principle
- Supplier lifecycle management
- Approval governance
- Rejection workflows
- Audit records

This README provides the complete setup, architecture, API documentation, workflow, and operational instructions for the project.
