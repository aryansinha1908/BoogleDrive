# BoogleDrive (File Storage Backend Project)
A backend focused project for uploading, downloading and storing files,
built using **Node.js**, **Express**, **MongoDB** and **JWT Authentication**.

## Features
- User authentication using JWT (cookies)
- Secure file upload using multer
- Stream-based file download
- Authorization checks per file owner
- MongoDB for metadata storage

### Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Multer (file uploads)
- bcrypt (password hashing)
- cookie-parser
- dotenv

### Environment Variables
Create a `.env` file in the root directory of the project.
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/boogledrive
JWT_SECRET=your_jwt_secret
UPLOAD_BASE_PATH=uploads
```

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/aryansinha1908/BoogleDrive.git
cd BoogleDrive
```

2. Install Dependencies
```bash
npm install
```

3. Start MongoDB

**NOTE: ** Make sure MongoDB is running locally
```bash
mongod
```

4. Start the server
```bash
npm start
```
Server will run on:
`http://localhost:3000`


### Authentication

1. User logs in using `/user/login`
2. Server:
    - Verifies credentials
    - Generates JWT
    - Stores JWT in an HTTP cookie
3. Protected routes use auth.middleware.js
4. JWT is verified on every protected request

### Authorization Rules
|Situation|Status Code|
|---------|-----------|
|Not logged in|`401 Unauthorized`|
|File not found|`404 Not Found`|
|Accessing someone else's file|`403 Forbidden`|

### Testing the API with Postman

This project can be fully tested using **Postman**.

#### 1. Register a New User

**Method:** `POST` 

**URL:** `http://localhost:3000/user/register` 

**Body (JSON):** 

```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

### 2. Login (Get JWT Cookie)

**Method:** `POST`

**URL:** `http://localhost:3000/user/login`

**Body (JSON):**

```json
{
    "username": "testuser",
    "password": "password123"
}
```
On successful login:
- Response: Logged in
- A cookie named `token` is set automatically

### 3. Upload a File (Protected Route)

**Method:** `POST`

**URL:** `http://localhost:3000/files/upload`

**Steps in Postman:**

1. Go to the Body tab
2. Select form-data
3. Add a field:
    - Key: `file`
    - Type: `File`
    - Value: Select any file from local machine

### 4. Download a File by ID (Protected Route)

**Method:** `GET`

**URL:** `http://localhost:3000/files/download/<fileId>`

If authorized:
- The file will be downloaded directly
- Only the Owner of the file can download it.

##### Author
**Aryan Sinha (aryansinha1908)**
