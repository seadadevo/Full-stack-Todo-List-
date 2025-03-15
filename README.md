# Full-Stack Todo List

## 📌 Overview
This is a **Full-Stack Todo List** application built using **React.js** for the frontend and **Strapi** as the backend. The app allows users to **register, log in, create, edit, delete, and paginate todos**. It also features **form validation, API handling, and loading skeletons** for a smooth user experience.

## 🛠️ Technologies Used
### Frontend (React.js):
- **React Hook Form** - For handling form validation.
- **React Hot Toast** - For displaying notifications.
- **Axios** - For API requests.
- **Yup** - Schema validation for forms.
- **React Skeleton** - For loading placeholders.
- **React Query** - For fetching and caching API data.
- **Faker.js** - To generate fake data for testing.

### Backend (Strapi):
- **Strapi CMS** - For building the API.
- **PostgreSQL** - Database for storing todos and user information.
- **Postman** - Used for testing API endpoints.

---
## ✨ Features
### ✅ Authentication:
- User **registration** with form validation.
- User **login** and **logout**.
- Password validation using **Yup**.

### ✅ Todo Management:
- **Create** new todos.
- **Edit** existing todos.
- **Delete** todos.
- **Paginate** through todos.
- Generate **fake todos** for testing.

### ✅ API Handling:
- Secure API requests using **Axios**.
- Manage API data using **React Query**.
- Display success/error messages using **React Hot Toast**.

---
## 🚀 Installation & Setup
### 1️⃣ Clone the repository:
```sh
git clone https://github.com/your-username/full-stack-todo-list.git
cd full-stack-todo-list
```

### 2️⃣ Install dependencies:
#### 📌 Backend (Strapi)
```sh
cd TodoListStrapi
npm install
npm run develop
```

#### 📌 Frontend (React)
```sh
cd todoListFr
npm install
npm start
```

---
## 🔥 API Usage (Example Requests)
### 🔹 User Registration
```js
axios.post('/api/auth/register', {
  username: 'testUser',
  email: 'test@example.com',
  password: 'password123',
});
```

### 🔹 Create a Todo
```js
axios.post('/api/todos', {
  title: 'New Todo',
  description: 'This is a new task.',
});
```

### 🔹 Fetch Todos (with Pagination)
```js
axios.get('/api/todos?page=1&limit=10');
```

---
## ⚠️ Issues Faced
### **Strapi Populate Issue**
One of the major challenges faced was **Strapi's populate limitation**. By default, Strapi doesn’t populate relational data automatically, which caused issues when trying to fetch related fields (e.g., user details in todos). 

**Solution:** We had to manually define `populate` in the request like this:
```js
axios.get('/api/todos?populate=user');
```
but it's not working at the end!😢
Even though this is an official Strapi limitation, it was frustrating to deal with.


---
## 🏆 Contributing
Feel free to fork this repository, submit issues, and contribute! 😊

---
## 📜 License
This project is **open-source** and available under the **MIT License**.
