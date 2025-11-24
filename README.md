# 📘 **README.md**

```md
# 🚀 Code Snippet Manager  
A full-stack web application to save, organize, search, and manage code snippets efficiently.  
Built using **MERN Stack** with secure authentication, advanced search, and clean UI.

---

## 🌐 Live Demo  
**Frontend:** https://code-snippet-manager-frontend.onrender.com  
**Backend (Render URL):(https://code-snippet-manager-backend-7v42.onrender.com)

---

## 📌 Features

### 🔐 Authentication  
- User registration & login  
- JWT-based authentication  
- Secure password hashing  

### 📝 Snippet Management  
- Create, edit, delete code snippets  
- Organize by tags, language, and category  
- Search snippets instantly  
- Copy code with one click  

### 🛡 Security  
- Helmet for security headers  
- Rate limiting to prevent attacks  
- CORS enabled for authorized domains  
- Secure error handling  

### 📚 Additional Features  
- Fully responsive UI  
- Clean folder structure  
- Health check API  
- MongoDB index cleanup (avoids text index conflicts)

---

## 🏗 Tech Stack

### **Frontend**
- React.js  
- Tailwind CSS  
- Axios  
- React Router  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Helmet, CORS, Morgan, Rate Limiter  

---

## 📂 Project Structure

```

backend/
│── server.js
│── routes/
│   ├── auth.js
│   ├── snippets.js
│   └── users.js
│── controllers/
│── models/
│── middleware/
│── config/
│── .env
│── package.json

frontend/
│── src/
│── public/
│── dist/ (production build)
│── package.json

````

---

## ⚙️ Backend Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/ManojkumarBalini/code-snippet-manager.git
cd code-snippet-manager/backend
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

```
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 4️⃣ Start backend

```bash
npm start
```

---

## 🎨 Frontend Setup

### 1️⃣ Navigate to frontend folder

```bash
cd ../frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run development server

```bash
npm run dev
```

### 🌐 Build for production

```bash
npm run build
```

---

## 🚀 Deployment (Render)

### Backend Build & Start Commands

```
Build Command: npm install
Start Command: node server.js
```

### Environment Variables

```
MONGODB_URI=
JWT_SECRET=
NODE_ENV=production
```

### Frontend Deployment

Your frontend is deployed at:
👉 [https://code-snippet-manager-frontend.onrender.com](https://code-snippet-manager-frontend.onrender.com)

Make sure backend CORS includes:

```js
origin: [
  "http://localhost:3000",
  "https://code-snippet-manager-frontend.onrender.com"
]
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

### 📝 Snippets

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | `/api/snippets`     | Get all snippets |
| POST   | `/api/snippets`     | Create snippet   |
| PUT    | `/api/snippets/:id` | Update snippet   |
| DELETE | `/api/snippets/:id` | Delete snippet   |

### 👤 Users

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | `/api/users/me` | Get logged in user's profile |

---

## ❤️ Author

**Manoj Kumar Balini**
Developer | Full-Stack | AI/ML

---

## ⭐ Contribute

Feel free to fork this repo and submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.
