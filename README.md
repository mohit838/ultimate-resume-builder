# 🧾 Ultimate Resume Builder

Ultimate Resume Builder is a full-stack backend application designed to help users manage categories (and eventually resumes, users, etc.) using Node.js, MySQL, and Redis — with a clean, modular codebase that's easy to scale and maintain.

---

## 📦 Tech Stack

- **Node.js** with **Express** (API server)
- **TypeScript** (type safety & productivity)
- **MySQL** (relational database)
- **Redis** (caching, health check, rate-limiting)
- **Docker** (containerized development)
- **express-validator** (input validation)
- Clean Architecture: route → controller → service → repository → database

---

## 🛠️ Folder Structure

```bash
src/
├── config/            # App constants, database & Redis config
├── controllers/       # Handle incoming HTTP requests
├── models/            # TypeScript interfaces for data models
├── repositories/      # Actual DB queries
├── routes/            # API route definitions
├── services/          # Business logic between controller and repo
├── utils/             # Rate limiter and other helpers
├── errors/            # Custom error handling middleware
├── logger/            # Logger config (for now: uses morgan)
└── index.ts           # Main app entry point
```

````

---

## 🧪 Sample API: Category

- **POST** `/api/categories` → Create a category
- Later: add GET, PUT, DELETE, etc.

```json
POST /api/categories
{
  "name": "Frontend",
  "description": "UI work and web stuff"
}
```

---

## 🐳 Run This Project in Dev Mode

Make sure Docker is installed.

```bash
docker-compose -f docker-compose.resume.yml up -d
```

> 💡 This runs MySQL, Redis, MongoDB, and Redis Stack (GUI) on custom ports.

Then, in another terminal, start the Node.js server:

```bash
npm install
npm run dev
```

Or if using `ts-node` or `nodemon`:

```bash
npx ts-node src/index.ts
```

---

## 🛑 Stop All Containers

```bash
docker-compose -f docker-compose.resume.yml down
```

---

## ❤️ Why This Project Is Structured This Way

This codebase uses a **clean architecture** pattern to:

- Keep business logic out of controllers
- Make code **testable**, **maintainable**, and **scalable**
- Help you learn best practices for real-world projects

Even though it starts small, this setup works well for growing apps like:

- Resume builder (multi-user)
- Admin panels
- CMS/blog systems
- Portfolio APIs

---

## 📈 What's Coming Next

- User authentication (JWT)
- Resume upload & generation
- Public resume sharing
- Admin dashboard
- MongoDB for storing resume templates/content
- Redis for caching & sessions

---

## 🤝 Contributing

This project is in early development. If you're learning Node.js or clean backend architecture — you're welcome to clone, fork, or contribute.

---

## 📬 Contact

If you have questions, open an issue or message the creator!

---

```

---

### ✅ You Can Edit This Later To Add:
- Swagger once added
- MongoDB usage once integrated
- Deployment steps
- Link to Postman collection or GitHub repo
````
