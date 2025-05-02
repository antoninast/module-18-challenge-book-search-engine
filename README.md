# module-18-challenge-book-search-engine
## 🚀 Live Demo
Deployed website: https://module-18-challenge-book-search-engine-58vq.onrender.com/

## 📘 Project Overview: Book Search Engine
This project is a full-stack MERN application (MongoDB, Express.js, React, Node.js) enhanced with Apollo Server/Client and GraphQL. It allows users to search for books using the Google Books API, save books to their personal account, and manage their saved list through a responsive web interface.

## 🔍 Core Purpose
The goal is to offer users a simple, intuitive platform where they can:
- Look up books of interest.
- Save books to a personalized reading list.
- Manage saved books (view or delete).
- Authenticate and protect their list using JWT-based login/signup.

## 🧩 Technologies Used
- MongoDB & Mongoose
- Express.js
- React
- Node.js
- Apollo Server & Client (GraphQL)
- JSON Web Tokens (JWT) for authentication
- Google Books API

## 🧪 How to Run Locally
1. Install dependencies:

```
npm install
cd server && npm install
cd ../client && npm install
```
2. Environment Variables:

Create a .env file in the server directory:
```
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongo_db_connection
```
3. Build the app:
```
npm run build
```

4. Run the app:
```
npm start
```

## 📚 License
This project is licensed under the MIT License.