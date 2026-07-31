# LIC WhatsApp Alert — Backend Roadmap

> MERN Stack Backend | Node.js + Express + MongoDB + node-cron + WhatsApp API

---

## 📁 Table of Contents

1. [Project Setup](#-phase-1--project-setup)
2. [Authentication](#-phase-2--authentication)
3. [Agent Module](#-phase-3--agent-module)
4. [Client Module](#-phase-4--client-module)
5. [Policy Module](#-phase-5--policy-module)
6. [Next Due Date Auto-Calculation](#-phase-6--next-due-date-auto-calculation)
7. [WhatsApp Integration](#-phase-7--whatsapp-integration)
8. [Cron Job — Alert Engine](#-phase-8--cron-job-alert-engine)
9. [Dashboard & Alert History](#-phase-9--dashboard--alert-history)
10. [Security & Validation](#-phase-10--security--validation)

---

## 🗂️ Phase 1 — Project Setup

- [ ] Create `server/` folder and run `npm init -y`
- [ ] Install core dependencies:

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors express-validator node-cron multer
npm install --save-dev nodemon
```

- [ ] Create `.env` file and add to `.gitignore`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

- [ ] Set up folder structure:

```
server/
├── models/
│   ├── Agent.js
│   ├── Client.js
│   └── Policy.js
├── routes/
│   ├── auth.routes.js
│   ├── agent.routes.js
│   ├── client.routes.js
│   ├── policy.routes.js
│   └── dashboard.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── agent.controller.js
│   ├── client.controller.js
│   ├── policy.controller.js
│   └── dashboard.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── utils/
│   ├── sendWhatsApp.js
│   └── calculateNextDueDate.js
├── jobs/
│   └── premiumAlertJob.js
├── config/
│   └── db.js
└── server.js
```

- [ ] Set up `server.js` with Express, CORS, JSON parser
- [ ] Set up `config/db.js` and connect MongoDB via Mongoose
- [ ] Add `nodemon` script in `package.json`:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

---

## 🔐 Phase 2 — Authentication

- [ ] Create `Agent` model ✅
- [ ] **Register Agent** — `POST /api/auth/register`
  - Validate name, email, password, agentCode
  - Check if email or agentCode already exists
  - Hash password using `bcryptjs`
  - Save agent and return JWT token
- [ ] **Login Agent** — `POST /api/auth/login`
  - Validate email & password
  - Compare password with `bcrypt.compare`
  - Return JWT token on success
- [ ] Create `auth.middleware.js`
  - Verify JWT from `Authorization: Bearer <token>` header
  - Attach `req.agent` with decoded agent data
  - Return `401` if token missing or invalid
- [ ] Add a health check route — `GET /api/health`

---

## 👤 Phase 3 — Agent Module

- [ ] **Get Agent Profile** — `GET /api/agent/profile`
  - Return logged-in agent's data (exclude password)
- [ ] **Update Agent Profile** — `PUT /api/agent/profile`
  - Allow updating name, whatsappNumber, branchName, etc.
  - Do not allow email or agentCode change here
- [ ] **Change Password** — `PUT /api/agent/change-password`
  - Verify old password first
  - Hash and save new password
- [ ] **Upload Profile Photo** — `PUT /api/agent/profile-photo`
  - Use `multer` to handle file upload
  - Save file path to `profilePhoto` field

---

## 👥 Phase 4 — Client Module

- [ ] Create `Client` model ✅
- [ ] **Add Client** — `POST /api/clients`
  - Validate required fields
  - Auto-attach `agent` from `req.agent._id`
  - Increment `agent.totalClients` by 1
- [ ] **Get All Clients** — `GET /api/clients`
  - Return only clients belonging to logged-in agent
  - Support query params: `?search=name&isActive=true`
  - Add pagination: `?page=1&limit=10`
- [ ] **Get Single Client** — `GET /api/clients/:id`
  - Populate their `policies` array
  - Ensure client belongs to logged-in agent
- [ ] **Update Client** — `PUT /api/clients/:id`
  - Validate ownership before updating
- [ ] **Delete Client** — `DELETE /api/clients/:id`
  - Validate ownership
  - Also delete all policies linked to that client
  - Decrement `agent.totalClients`

---

## 📋 Phase 5 — Policy Module

- [ ] Create `Policy` model ✅
- [ ] **Add Policy** — `POST /api/policies`
  - Validate required fields
  - Auto-attach `agent` from `req.agent._id`
  - Push new policy `_id` into `client.policies` array
  - Increment `agent.totalPolicies` by 1
- [ ] **Get All Policies** — `GET /api/policies`
  - Return only policies belonging to logged-in agent
  - Support filters: `?status=Active&clientId=xyz`
  - Add pagination
- [ ] **Get Policies by Client** — `GET /api/policies/client/:clientId`
  - Verify client belongs to logged-in agent
- [ ] **Get Single Policy** — `GET /api/policies/:id`
  - Populate `client` and `agent` fields
  - Ensure policy belongs to logged-in agent
- [ ] **Update Policy** — `PUT /api/policies/:id`
  - Validate ownership before updating
- [ ] **Delete Policy** — `DELETE /api/policies/:id`
  - Remove policy `_id` from `client.policies` array
  - Decrement `agent.totalPolicies`
- [ ] **Upload Policy Document** — `POST /api/policies/:id/documents`
  - Use `multer` to upload file
  - Push into `policy.documents` array

---

## 📅 Phase 6 — Next Due Date Auto-Calculation

- [ ] Create `utils/calculateNextDueDate.js`:

```js
// Monthly     → add 1 month
// Quarterly   → add 3 months
// Half-Yearly → add 6 months
// Yearly      → add 12 months
```

- [ ] **Mark Premium as Paid** — `PUT /api/policies/:id/mark-paid`
  - Call `calculateNextDueDate` with current due date + frequency
  - Update `nextPremiumDueDate` with the new date
  - Reset `lastAlertSentAt` to `null`
  - Add entry to a `paymentHistory` array (optional)

---

## 📲 Phase 7 — WhatsApp Integration

- [ ] Choose provider (Twilio / Meta Cloud API / Gupshup) and get credentials
- [ ] Add credentials to `.env`:

```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

- [ ] Create `utils/sendWhatsApp.js`
  - Accept `(toNumber, templateParams)` as arguments
  - Call provider API
  - Return `{ success, messageId }` or throw error
- [ ] Get a **WhatsApp Message Template** approved by provider:

```
Hi {{1}}, your LIC premium of ₹{{2}}
for policy {{3}} is due on {{4}}.
Please pay before the due date to avoid lapsing.
```

- [ ] Test the utility with a hardcoded number first

---

## ⏰ Phase 8 — Cron Job (Alert Engine)

- [ ] Create `jobs/premiumAlertJob.js`
- [ ] Write the daily alert logic:
  - [ ] Fetch all `Active` policies with `alertsEnabled: true`
  - [ ] Calculate `daysLeft = nextPremiumDueDate - today`
  - [ ] Check if `daysLeft` is in `alertDaysBefore` array
  - [ ] Skip if `lastAlertSentAt` is today (avoid duplicates)
  - [ ] Send WhatsApp to `client.whatsappNumber`
  - [ ] If `agent.receiveAlertCopy` is true, also send to agent
  - [ ] Push result into `policy.alertHistory`
  - [ ] Update `policy.lastAlertSentAt = new Date()`
- [ ] Schedule job to run daily at 9:00 AM:

```js
cron.schedule('0 9 * * *', premiumAlertJob);
```

- [ ] Register cron job in `server.js`

---

## 📊 Phase 9 — Dashboard & Alert History

- [ ] **Dashboard Stats** — `GET /api/dashboard/stats`
  - Total clients of logged-in agent
  - Total active policies
  - Policies due in next 7 days
  - Policies due in next 30 days
  - Count of alerts sent this month
- [ ] **Upcoming Due Policies** — `GET /api/dashboard/upcoming`
  - Return policies where `nextPremiumDueDate` is within next 30 days
  - Populate client name and whatsappNumber
- [ ] **Get Alert History (per policy)** — `GET /api/policies/:id/alerts`
  - Return `alertHistory` array of that policy
- [ ] **Get All Recent Alerts** — `GET /api/alerts`
  - Aggregate alert history across all agent's policies
- [ ] **Manual Send Alert** — `POST /api/policies/:id/send-alert`
  - Trigger WhatsApp message immediately for that policy
  - Log into `alertHistory`

---

## 🔒 Phase 10 — Security & Validation

- [ ] Add `express-validator` checks on all `POST` and `PUT` routes
- [ ] Ensure every route checks agent ownership (no agent can access another agent's data)
- [ ] Add global error handler middleware in `middlewares/error.middleware.js`
- [ ] Add `express-rate-limit` on auth routes to prevent brute force
- [ ] Sanitize inputs to prevent NoSQL injection (`$` in query params)
- [ ] Make sure no passwords are returned in any API response

---

## 🔗 API Reference Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new agent |
| POST | `/api/auth/login` | Agent login |
| GET | `/api/health` | Health check |
| GET | `/api/agent/profile` | Get agent profile |
| PUT | `/api/agent/profile` | Update agent profile |
| PUT | `/api/agent/change-password` | Change password |
| PUT | `/api/agent/profile-photo` | Upload profile photo |
| POST | `/api/clients` | Add new client |
| GET | `/api/clients` | Get all clients |
| GET | `/api/clients/:id` | Get single client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |
| POST | `/api/policies` | Add new policy |
| GET | `/api/policies` | Get all policies |
| GET | `/api/policies/client/:clientId` | Get policies by client |
| GET | `/api/policies/:id` | Get single policy |
| PUT | `/api/policies/:id` | Update policy |
| DELETE | `/api/policies/:id` | Delete policy |
| PUT | `/api/policies/:id/mark-paid` | Mark premium as paid |
| POST | `/api/policies/:id/documents` | Upload policy document |
| GET | `/api/policies/:id/alerts` | Get alert history for policy |
| POST | `/api/policies/:id/send-alert` | Manually send alert |
| GET | `/api/dashboard/stats` | Get dashboard stats |
| GET | `/api/dashboard/upcoming` | Get upcoming due policies |
| GET | `/api/alerts` | Get all recent alerts |

---

> Built with ❤️ using Node.js · Express · MongoDB · node-cron · WhatsApp API
