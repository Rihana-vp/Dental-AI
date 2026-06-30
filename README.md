# 🦷 SmileCare Dental AI Assistant

A production-style, interview-ready conversational AI backend for a dental clinic — built with **Node.js + Express.js**, featuring intent detection, appointment booking, validation, centralized error handling, and a polished single-page chat frontend.

---

## 📌 Project Overview

SmileCare Dental AI Assistant processes natural-language messages from patients and returns structured, intent-driven responses. It can book appointments, answer queries about clinic timings and services, and greet general visitors — all without an external database or AI API.

---

## ✨ Features

- **Intent Detection** — Classifies messages into `BOOK_APPOINTMENT`, `ASK_TIMINGS`, `ASK_SERVICES`, or `GENERAL_QUERY`
- **Service Extraction** — Identifies the requested dental service from free-text input
- **Date Extraction** — Parses relative date references (today, tomorrow, next Monday…)
- **In-Memory Booking** — Stores appointments with UUID identifiers for the session lifetime
- **Request Validation** — Rejects empty or missing messages with HTTP 400
- **Centralized Error Handling** — Global Express error middleware returns safe HTTP 500 responses
- **Static Frontend** — Responsive, no-framework chat UI served directly by Express
- **Postman Ready** — Clean REST endpoint compatible with any API testing tool

---

## 🏗️ Architecture

```
Request → validateMessage (middleware)
        → chatController (orchestrator)
            → detectIntent   (intentService)
            → buildResponse  (responseService)
                → extractService (util)
                → extractDate    (util)
                → createAppointment (bookingService)  [booking only]
        → JSON Response
```

**Separation of concerns:**
- `routes/` — URL mapping only
- `controllers/` — request/response orchestration
- `services/` — all business logic
- `utils/` — pure extraction helpers
- `middleware/` — cross-cutting concerns (validation, errors)
- `data/` — static clinic configuration

---

## 📁 Folder Structure

```
smilecare-dental-ai-assistant/
│
├── app.js                          # Express app entry point
├── package.json
├── .env.example
├── .gitignore
├── README.md
│
├── src/
│   ├── controllers/
│   │   └── chatController.js       # POST /api/chat handler
│   │
│   ├── routes/
│   │   └── chatRoutes.js           # Route definitions
│   │
│   ├── services/
│   │   ├── intentService.js        # Intent detection logic
│   │   ├── responseService.js      # Response builder per intent
│   │   └── bookingService.js       # In-memory appointment store
│   │
│   ├── utils/
│   │   ├── extractDate.js          # Date keyword parser
│   │   └── extractService.js       # Service name matcher
│   │
│   ├── middleware/
│   │   ├── validateMessage.js      # Input validation middleware
│   │   └── errorHandler.js         # Centralized error handler
│   │
│   └── data/
│       └── clinicData.js           # Clinic config (services, hours, contact)
│
└── public/
    ├── index.html                  # Chat UI
    ├── styles.css                  # Modern responsive CSS
    └── app.js                      # Frontend JS (fetch API + DOM)
```

---

## ⚙️ Installation

**Prerequisites:** Node.js v16+

```bash
# 1. Clone the repository
git clone https://github.com/your-username/smilecare-dental-ai-assistant.git
cd smilecare-dental-ai-assistant

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

---

## 🚀 Running Locally

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## 📡 API Documentation

### `POST /api/chat`

Processes a user message and returns an intent-driven response.

**Request**

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Book root canal tomorrow"
}
```

**Success Response** — `200 OK`

```json
{
  "success": true,
  "intent": "BOOK_APPOINTMENT",
  "service": "Root Canal",
  "date": "Tomorrow",
  "reply": "Sure! I can help you book a Root Canal appointment tomorrow."
}
```

**Validation Error** — `400 Bad Request`

```json
{
  "success": false,
  "message": "Message is required"
}
```

**Server Error** — `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 🧪 Sample Requests & Responses

### 1. Ask Timings

**Request**
```json
{ "message": "What are your timings?" }
```

**Response**
```json
{
  "success": true,
  "intent": "ASK_TIMINGS",
  "reply": "We are open Monday to Friday from 10:00 AM to 7:00 PM."
}
```

---

### 2. Ask Services

**Request**
```json
{ "message": "What services do you provide?" }
```

**Response**
```json
{
  "success": true,
  "intent": "ASK_SERVICES",
  "reply": "We provide Dental Cleaning, Root Canal, Braces and Teeth Whitening."
}
```

---

### 3. Book Appointment

**Request**
```json
{ "message": "Book braces appointment next Monday" }
```

**Response**
```json
{
  "success": true,
  "intent": "BOOK_APPOINTMENT",
  "service": "Braces",
  "date": "Next Monday",
  "reply": "Sure! I can help you book a Braces appointment next monday."
}
```

---

### 4. General Query

**Request**
```json
{ "message": "Hello" }
```

**Response**
```json
{
  "success": true,
  "intent": "GENERAL_QUERY",
  "reply": "Hello! Welcome to SmileCare Dental. How can I assist you today?"
}
```

---

### 5. Validation Error

**Request**
```json
{}
```

**Response** (`400`)
```json
{
  "success": false,
  "message": "Message is required"
}
```

---

## ✅ Test Cases

| Input | Expected Intent | Service | Date |
|---|---|---|---|
| `"What are your timings?"` | `ASK_TIMINGS` | — | — |
| `"What services do you provide?"` | `ASK_SERVICES` | — | — |
| `"Book root canal tomorrow"` | `BOOK_APPOINTMENT` | Root Canal | Tomorrow |
| `"Schedule teeth whitening next friday"` | `BOOK_APPOINTMENT` | Teeth Whitening | Next Friday |
| `"I need braces appointment today"` | `BOOK_APPOINTMENT` | Braces | Today |
| `"Are you open on weekends?"` | `ASK_TIMINGS` | — | — |
| `"Hello"` | `GENERAL_QUERY` | — | — |
| `""` (empty body) | Validation Error 400 | — | — |

---

## 🔮 Future Improvements

- **Persistent Database** — Replace in-memory store with MongoDB or PostgreSQL
- **NLP Integration** — Plug in OpenAI / Dialogflow for richer intent understanding
- **Authentication** — JWT-based patient login for personal appointment history
- **Appointment Management** — Add GET, PATCH, DELETE endpoints for full CRUD
- **SMS/Email Notifications** — Confirmation messages via Twilio or Nodemailer
- **Rate Limiting** — `express-rate-limit` to prevent abuse
- **Unit Tests** — Jest test suite covering all services and middleware
- **Docker Support** — `Dockerfile` + `docker-compose.yml` for containerized deployment
- **CI/CD Pipeline** — GitHub Actions workflow for automated testing and deployment

---

## 📞 Clinic Contact

| Field | Value |
|---|---|
| Phone | 9876543210 |
| Email | support@smilecare.com |
| Hours | Monday–Friday, 10:00 AM – 7:00 PM |

---

## 📄 License

MIT © SmileCare Dental
