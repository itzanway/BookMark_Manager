# 🔖 Bookmark Manager

A full-stack application to save, organize, and search your favorite website links. Built with **React (Vite)** and **Node.js/Express**, featuring a clean UI, dark mode, and tag management.

---

# 📂 Project Structure

This project follows a modular full-stack structure, separating the frontend (`client`) and backend (`server`).

```text
bookmark-manager/
├── client/                     # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── BookmarkCard.jsx  # Individual bookmark display
│   │   │   ├── Modal.jsx         # Add/Edit form overlay
│   │   │   └── Sidebar.jsx       # Category navigation sidebar
│   │   ├── App.css             # Main stylesheet (Variables, Dark Mode)
│   │   ├── App.jsx             # Main Application Logic
│   │   ├── index.css           # CSS Reset
│   │   └── main.jsx            # React Entry Point
│   ├── index.html              # HTML Entry Point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Node.js Backend
│   ├── routes/                 # API Route Handlers
│   │   ├── bookmarks.js        # CRUD for Bookmarks
│   │   └── categories.js       # CRUD for Categories
│   ├── data.json               # JSON Persistence Layer (Database)
│   ├── index.js                # Server Entry Point
│   └── package.json            # Backend dependencies
│
└── README.md                   # Project Documentation
```

---

# 🚀 Features

## 🔹 Core Functionality

- **CRUD Operations**: Create, Read, and Delete bookmarks.
- **Categorization**: Filter bookmarks by dynamic categories (Development, Design, etc.).
- **Search & Filter**: Real-time search by title, description, or tags.
- **Data Persistence**: Uses a local `data.json` file to store data across server restarts.

---

## 🌟 Bonus Features Implemented

- 🌗 **Dark Mode**: System-wide dark theme toggle using CSS variables.
- 🏷️ **Tags**: Support for adding multiple tags to bookmarks for granular organization.
- 🖼️ **Favicons**: Automatically fetches high-quality favicons for saved URLs.
- 📈 **Click Tracking**: Tracks link visits and supports sorting by "Most Visited".
- ⌨️ **Keyboard Shortcuts**: Press `Ctrl + N` (or `Cmd + N`) to open the "Add New" modal.
- 📥 **Import/Export**: Backup and restore bookmarks via JSON file upload/download.

---

# 🛠️ Tech Stack

##  Clone the Repository

```bash
git clone https://github.com/your-username/bookmark-manager.git
cd bookmark-manager
```

---

### Frontend
- React 18
- Vite
- CSS3 (Flexbox & Grid)
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- CORS

### Database
- Local File System (`fs`) with JSON storage

---

# ⚙️ Installation & Setup

## 📌 Prerequisites
- Node.js (v14+) installed on your machine

---

## 1️⃣ Backend Setup

The backend runs on **Port 5000**.

```bash
mkdir server && cd server

cd bookmark-manager/server

# Install dependencies
npm init -y
npm install express cors
OR
npm install

# Start the server
node index.js
```

> Note: The server will automatically load initial data from `data.json`.

---

## 2️⃣ Frontend Setup

The frontend runs on **Port 5173** (default Vite port).  
Open a new terminal window:

```bash
cd bookmark-manager/client

# Install dependencies
npm create vite@latest client -- --template react
npm install

# Start the development server
npm run dev
```

---

## 3️⃣ Access the App

Open your browser and navigate to:

```
http://localhost:5173
```

---

# 📡 API Endpoints

The backend exposes the following RESTful endpoints at:

```
http://localhost:5000
```

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/bookmarks` | Fetch bookmarks. Supports `?category=id`, `?search=text`, `?sort=most-visited` |
| POST | `/api/bookmarks` | Create a bookmark. Body: `{ title, url, categoryId, tags, description }` |
| DELETE | `/api/bookmarks/:id` | Delete a bookmark by ID |
| POST | `/api/bookmarks/:id/click` | Increment the click count for a specific bookmark |
| POST | `/api/bookmarks/import` | Bulk import an array of bookmarks |
| GET | `/api/categories` | Get all categories with their bookmark counts |
| POST | `/api/categories` | Create a new category. Body: `{ name }` |

---

# 🧠 How It Works

- The frontend communicates with the backend via REST APIs.
- The backend uses Express route handlers to manage bookmarks and categories.
- Data is stored in `data.json` and persisted using Node's `fs` module.
- The UI dynamically updates using React state and hooks.
- Dark mode is handled via CSS variables for seamless theme switching.

---

# 👨‍💻 Author
Made by ANWAY DURGE
