# 🔖 Bookmark Manager

A modern full-stack application to save, organize, and search your favorite website links.

Built using **React (Vite)** for the frontend and **Node.js + Express** for the backend, this application features dark mode, tag management, click tracking, and import/export functionality — all wrapped in a clean and modular UI.

---

# 📂 Project Structure

```text
bookmark-manager/
├── client/                     # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookmarkCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── routes/
│   │   ├── bookmarks.js
│   │   └── categories.js
│   ├── data.json
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Features

## 🔹 Core Functionality

- CRUD Operations for bookmarks
- Category-based filtering
- Real-time search (title, description, tags)
- Persistent storage using `data.json`

## 🌟 Bonus Features

- 🌗 Dark Mode toggle
- 🏷️ Multiple tags per bookmark
- 🖼️ Automatic favicon fetching
- 📈 Click tracking with "Most Visited" sorting
- ⌨️ Keyboard shortcut (`Ctrl + N` / `Cmd + N`)
- 📥 JSON Import & Export functionality

---

# 🛠️ Tech Stack

## Frontend
- React 18
- Vite
- CSS3 (Flexbox & Grid)
- Lucide React Icons

## Backend
- Node.js
- Express.js
- CORS

## Database
- Local file-based storage using `fs` module

---

# ⚙️ Installation & Setup

## 📌 Prerequisites
- Node.js (v14+)
- npm

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/bookmark-manager.git
cd bookmark-manager
```

---

## 2️⃣ Backend Setup (Port 5000)

```bash
cd server
npm install
node index.js
```

Server runs at:
```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup (Port 5173)

Open a new terminal:

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

# 📡 API Endpoints

Base URL:
```
http://localhost:5000
```

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/bookmarks` | Fetch bookmarks (supports filters & sorting) |
| POST | `/api/bookmarks` | Create bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |
| POST | `/api/bookmarks/:id/click` | Increment click count |
| POST | `/api/bookmarks/import` | Bulk import bookmarks |
| GET | `/api/categories` | Fetch categories |
| POST | `/api/categories` | Create category |

---

# 🧠 How It Works

- React manages UI and state.
- Express handles REST API routes.
- Data is stored locally in `data.json`.
- Search and filtering are handled server-side.
- Dark mode is implemented using CSS variables.
- Click tracking updates a visit counter per bookmark.

---

# ⏳ Time Spent

| Task | Approx. Time |
|------|-------------|
| Backend API development | 1 hour |
| Frontend UI & Components | 1–1.5 hours |
| Dark mode & UI polishing | 30 minutes |
| Bonus features (tags, click tracking, import/export) | 45 minutes |
| Testing & debugging | 30–45 minutes |

**Total Estimated Time:** ~3–4 hours

---

# 🔮 What I Would Improve

- ✏️ Add Edit/Update bookmark functionality
- 🔐 Implement user authentication (JWT-based)
- ☁️ Replace JSON storage with MongoDB or PostgreSQL
- 📱 Improve mobile responsiveness
- 🚀 Deploy frontend (Vercel) and backend (Render)
- 🧪 Add unit & integration testing
- 🧑‍🤝‍🧑 Support multi-user accounts
- 🔍 Add advanced filtering (date added, tag grouping)

---

# 👨‍💻 Author

**Anway Durge**

Full Stack Developer  
Passionate about building clean, scalable web applications.

---

# 📄 License

This project is open-source and available under the MIT License.
