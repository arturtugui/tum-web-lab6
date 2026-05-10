# Lab 7 Concepts — Backend Development with Express.js & REST API

> Tailored for someone with Java/Python experience and basic HTTP knowledge.
> Building a REST API backend for the Personal Interest Tracker (Lab 6 frontend).

---

## 1. REST API Basics

REST = Representational State Transfer. A way to structure web APIs using standard HTTP methods.

### HTTP Methods (CRUD Mapping)

| Method   | Purpose                   | Example                             |
| -------- | ------------------------- | ----------------------------------- |
| `GET`    | Retrieve data (read-only) | `GET /items` → fetch all items      |
| `POST`   | Create new data           | `POST /items` → add new item        |
| `PUT`    | Replace entire resource   | `PUT /items/5` → replace item 5     |
| `PATCH`  | Partially update          | `PATCH /items/5` → update one field |
| `DELETE` | Remove data               | `DELETE /items/5` → delete item 5   |

**Think of it like:** REST treats data as "resources" with standard CRUD operations, just like methods in Java:

```java
// Java:
items.add(newItem)          // POST /items
Item item = items.get(5)    // GET /items/5
items.update(5, updated)    // PUT /items/5
items.delete(5)             // DELETE /items/5
```

### REST Endpoints (URLs)

URLs represent _resources_, not actions:

```
❌ WRONG:  /getItems, /createItem, /deleteItem (verb-based)
✅ RIGHT:  /items (noun-based, method determines action)

GET    /items              → list all
POST   /items              → create one
GET    /items/5            → fetch item 5
PUT    /items/5            → replace item 5
PATCH  /items/5            → update item 5
DELETE /items/5            → delete item 5

PATCH  /items/5/hide       → special action (ok for this)
```

### HTTP Status Codes

Server tells client what happened:

| Code | Meaning      | Use                        |
| ---- | ------------ | -------------------------- |
| 200  | OK           | Request succeeded          |
| 201  | Created      | New resource created       |
| 400  | Bad Request  | Client sent invalid data   |
| 401  | Unauthorized | Missing/invalid auth token |
| 403  | Forbidden    | Auth valid but not allowed |
| 404  | Not Found    | Resource doesn't exist     |
| 500  | Server Error | Server crashed             |

**Think of it like:** HTTP status codes as Java exceptions:

```java
if (token == null) throw new UnauthorizedException();  // 401
if (item == null) throw new NotFoundException();        // 404
if (validation.fails()) throw new BadRequestException(); // 400
```

---

## 2. JWT (JSON Web Token) — Authentication

JWT is a **token** that proves "I am who I say I am."

### How JWT Works

```
1. Client: POST /token with role
   Body: { "role": "owner" }

2. Server generates token:
   Header: { "alg": "HS256", "typ": "JWT" }
   Payload: { "role": "owner", "iat": 1609459200, "exp": 1609459260 }
   Signature: HMAC-SHA256(header + payload + secret)
   Result: "eyJhbGc.eyJyb2xl.SflKxw"

3. Client receives: { "token": "eyJhbGc.eyJyb2xl.SflKxw" }

4. Client stores token (memory or localStorage)

5. For every request, client sends:
   Authorization: Bearer eyJhbGc.eyJyb2xl.SflKxw

6. Server verifies token:
   - Decode payload
   - Check signature (using secret key)
   - Check expiration
   - Extract role
   - If valid → allow request
   - If invalid/expired → return 401
```

### JWT Structure

```
eyJhbGc.eyJyb2xl.SflKxw
│      │        │
Header Payload  Signature
```

**Payload (base64 decoded):**

```json
{
  "role": "owner", // Your custom data
  "iat": 1609459200, // Issued At (timestamp)
  "exp": 1609459260 // Expiration (timestamp, usually iat + 60 seconds)
}
```

**Key concept:** JWT is _signed_, not encrypted. Anyone can read the payload, but only the server (with the secret) can create valid signatures. If payload changes, signature becomes invalid.

**Think of it like:** JWT as a signed letter:

- Anyone can read what's inside (it's not secret)
- But only you can sign it with your handwriting
- If someone modifies the letter, the signature won't match

---

## 3. Express.js — Node.js Web Framework

Express is the JavaScript equivalent of Flask (Python) or Spring Boot (Java) — but much simpler.

### Basic Server Structure

```js
const express = require('express')
const app = express()

// Middleware: runs on every request
app.use(express.json())  // Parse JSON bodies

// GET route
app.get('/items', (req, res) => {
  res.json({ items: [...] })  // Send JSON response
})

// POST route
app.post('/items', (req, res) => {
  const newItem = req.body  // Get JSON from request body
  items.push(newItem)
  res.status(201).json(newItem)  // 201 = Created
})

// Start server
app.listen(3000, () => console.log('Server running on port 3000'))
```

**Key concepts:**

- `app.get()` — define GET endpoint
- `app.post()` — define POST endpoint
- `req` — incoming request (headers, body, params)
- `res` — outgoing response (send JSON, status code, etc)
- Middleware — functions that run before/after routes (like Java filters)

### Middleware (Request Processing)

Middleware runs in order before reaching your route:

```js
app.use(express.json())                    // Parse JSON
app.use(cors())                            // Allow cross-origin
app.use(authMiddleware)                    // Check token
app.get('/items', (req, res) => { ... })   // Route handler
```

**Example: JWT verification middleware**

```js
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Continue to route handler
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

Then use it:

```js
app.get('/items', authMiddleware, (req, res) => {
  // req.user is now available here
  res.json({ items: [...], user: req.user })
})
```

---

## 4. Docker — Containerization

Docker packages your app with all dependencies into a "container" — like a small virtual machine.

### Dockerfile (Recipe)

```dockerfile
FROM node:18-alpine              # Start with Node 18 image
WORKDIR /app                     # Set working directory
COPY package*.json ./            # Copy package files
RUN npm install                  # Install dependencies
COPY . .                         # Copy app code
EXPOSE 3000                      # Document port
CMD ["npm", "start"]             # Run command
```

**Think of it like:** Dockerfile as installation instructions:

1. Start with a base OS (Node.js 18)
2. Set up workspace
3. Install dependencies
4. Copy code
5. Run the app

### Building & Running

```bash
# Build image
docker build -t lab7-backend .

# Run container
docker run -p 3000:3000 lab7-backend
# -p 3000:3000 maps port 3000 inside container to localhost:3000
```

### docker-compose.yml (Run Multiple Containers)

```yaml
version: "3"
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - JWT_SECRET=your_secret_key
```

Run both frontend and backend:

```bash
docker-compose up
```

---

## 5. Pagination — Handling Large Data

When you have thousands of items, don't return all at once. Fetch in chunks.

### Query Parameters

```
GET /items?limit=10&offset=0    # First 10 items
GET /items?limit=10&offset=10   # Next 10 items
GET /items?limit=10&offset=20   # Next 10 items
```

**Implementation:**

```js
app.get("/items", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const paginated = items.slice(offset, offset + limit);

  res.json({
    items: paginated,
    total: items.length,
    limit,
    offset,
  });
});
```

**Frontend usage:**

```js
// Fetch page 2 (assuming 10 items per page)
fetch("/items?limit=10&offset=10")
  .then((r) => r.json())
  .then((data) => {
    console.log(data.items); // 10 items
    console.log(data.total); // Total available
  });
```

---

## 6. CORS (Cross-Origin Resource Sharing)

By default, browsers block requests from one origin to another:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

These are different origins, so browser blocks the request → CORS error.

### Solution: Enable CORS

```js
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow this origin
    credentials: true, // Allow cookies/auth headers
  }),
);
```

Now frontend can call backend without errors.

---

## 7. Environment Variables (.env)

Store secrets outside of code:

```
# .env file
JWT_SECRET=my_super_secret_key_do_not_share
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```js
// Access in code
const secret = process.env.JWT_SECRET;
```

**Why:**

- ✅ Don't commit secrets to git
- ✅ Different values for dev/prod
- ✅ Easy to change without code changes

---

## 8. Quick Reference — Typical Request Flow

```
1. Frontend makes request:
   POST /token
   Body: { "role": "owner" }

2. Backend receives, `/token` handler runs:
   app.post('/token', (req, res) => {
     const token = jwt.sign({ role: req.body.role }, secret, { expiresIn: '1m' })
     res.json({ token })
   })

3. Frontend stores token, makes authenticated request:
   GET /items
   Headers: { Authorization: "Bearer <token>" }

4. Backend middleware verifies token:
   authMiddleware extracts token, verifies signature
   If valid → req.user = decoded token data
   If invalid → return 401

5. Backend route handler processes request:
   app.get('/items', authMiddleware, (req, res) => {
     res.json({ items: [...], user: req.user })
   })

6. Frontend receives response and updates UI
```

---

## 9. File Structure for Lab 7 Backend

```
backend/
├── server.js                    # Express app entry point
├── package.json                 # Dependencies
├── .env                         # Secrets (not in git)
├── .env.example                 # Template for .env
├── Dockerfile                   # Container recipe
├── docker-compose.yml           # Run command
│
├── config/
│   └── db.js                    # Database connection (if using DB)
│
├── middleware/
│   └── auth.js                  # JWT verification
│
├── routes/
│   ├── auth.js                  # /token endpoint
│   └── items.js                 # /items, /items/:id, etc
│
├── controllers/
│   ├── authController.js        # Token generation logic
│   └── itemsController.js       # CRUD logic
│
└── swagger.js                   # Swagger documentation config
```

---

## 10. Testing Your API (Postman / cURL)

### Get Token (cURL)

```bash
curl -X POST http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{"role":"owner"}'

# Response: {"token":"eyJhbGc..."}
```

### Use Token to Fetch Items

```bash
TOKEN="eyJhbGc..."

curl http://localhost:3000/items \
  -H "Authorization: Bearer $TOKEN"

# Response: {"items":[...]}
```

### Create Item

```bash
curl -X POST http://localhost:3000/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Inception",
    "category":"movie",
    "status":"completed",
    "rating":9,
    "coverUrl":"..."
  }'
```

---

## 11. npm Packages You'll Use

```bash
npm install express              # Web framework
npm install cors                 # Cross-origin support
npm install jsonwebtoken         # JWT generation/verification
npm install bcryptjs             # Password hashing (if needed)
npm install dotenv               # Environment variables
npm install swagger-ui-express   # Swagger docs
npm install swagger-jsdoc        # Swagger JSDoc comments

npm install --save-dev nodemon   # Auto-restart on file changes
```

---

## Quick Comparison: Java vs Express.js

| Concept     | Java (Spring)                       | JavaScript (Express)        |
| ----------- | ----------------------------------- | --------------------------- |
| Server      | Spring Boot runs on port 8080       | Express runs on port 3000   |
| Route       | `@GetMapping("/items")`             | `app.get('/items', ...)`    |
| Status Code | `return ResponseEntity.status(201)` | `res.status(201).json(...)` |
| Middleware  | Interceptors                        | `app.use(middleware)`       |
| JWT         | `@EnableWebSecurity`                | `jwt.verify()`              |
| Config      | `application.properties`            | `.env` file                 |
| Run         | `mvn spring-boot:run`               | `npm start`                 |
| Docker      | `docker build -f Dockerfile .`      | Same concept                |

---

Done! You now have the foundation. Follow the combined-roadmap.md for step-by-step implementation.

## 12. Route Parameters (req.params)

When your URL contains a variable segment (like an item ID), Express captures it via `req.params`:

```js
// :id is a named parameter
app.get("/items/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id); // "5" → 5
  const item = items.find((i) => i.id === id);

  if (!item) return res.status(404).json({ error: "Item not found" });

  res.json(item);
});
```

`req.params.id` matches whatever is in the URL:

- `GET /items/5` → `req.params.id === "5"`
- `GET /items/42` → `req.params.id === "42"`

Note: params are always strings — parse with `parseInt()` if you need a number.

---

## 13. Input Validation

Express does not validate request bodies for you. If a client sends incomplete data, you must check manually before saving:

```js
app.post("/items", authMiddleware, (req, res) => {
  const { title, category, status } = req.body;

  // Validate required fields
  if (!title || !category || !status) {
    return res
      .status(400)
      .json({ error: "title, category, and status are required" });
  }

  // Safe to save now
  const newItem = { id: nextId++, title, category, status, ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});
```

Unlike Spring Boot (`@Valid`, `@NotNull`), Express has no built-in validation — it's your responsibility on every POST/PUT route.

---

## 14. Error Handling Middleware

If an unexpected error occurs in a route, you don't want the server to crash. Express has a special 4-argument middleware for this — place it at the very end of `server.js`, after all routes:

```js
// Normal middleware: 3 args (req, res, next)
// Error middleware:  4 args (err, req, res, next) ← Express detects this automatically
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});
```

To trigger it from a route, pass an error to `next()`:

```js
app.get("/items", authMiddleware, (req, res, next) => {
  try {
    // ... your logic
  } catch (err) {
    next(err); // Passes error to the error-handling middleware above
  }
});
```

Think of it like a global try-catch for your entire server.
