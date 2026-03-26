# straydog.blog

A travel journal and social platform for adventurers. Create living adventure logs, share your journey post by post, and follow other Stray Dogs on the road.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |
| Monorepo | npm workspaces + concurrently |

---

## Project Structure

```
straydog-blog/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components (Navbar, etc.)
│       └── pages/        # Route-level page components
├── server/          # Express backend
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose models
│   ├── routes/      # Express routers
│   └── middleware/  # Custom middleware
└── package.json     # Root — runs both servers concurrently
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/88joshua88/straydog-blog.git
cd straydog-blog
```

### 2. Install all dependencies

Install root, client, and server dependencies in one command:

```bash
npm run install:all
```

Or manually:

```bash
# Root (concurrently)
npm install

# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 3. Configure environment variables

Copy/rename the server `.env` file and fill in your credentials:

```bash
cd server
# Edit .env — it already exists with placeholders
```

```env
PORT=5000
MONGO_URI=your_mongo_uri_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the app

From the **project root**:

```bash
npm run dev
```

This starts both servers simultaneously:
- **Frontend** → http://localhost:5173
- **Backend** → http://localhost:5000

### 5. Verify both servers are live

- Open http://localhost:5173 in your browser — you should see the straydog.blog homepage with the Navbar.
- Visit http://localhost:5000/api/health — you should see: `{ "message": "straydog server is running" }`

---

## Available Routes (Frontend)

| Path | Page |
|------|------|
| `/` | Home |
| `/login` | Login |
| `/signup` | Sign Up |
| `/forgot-password` | Forgot Password |
| `/dashboard` | Dashboard |
| `/create-adventure` | Create Adventure |
| `/find-adventures` | Find Adventures |
| `/adventure/:id` | Adventure Detail |

## API Routes (Backend)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |

---

*Built with grit and curiosity. Every road has a story.*
