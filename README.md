# BoogleDrive (File Storage Backend Project)
A backend-focused project for uploading, downloading, and storing files.
Built using **Node.js**, **Express**, **MongoDB** and **JWT Authentication**.

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
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/boogledrive
JWT_SECRET=your_jwt_secret

SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_service_key

SUPABASE_BUCKET=uploads
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

### Authorization Rules
| Situation                     | Status Code        |
| ----------------------------- | ------------------ |
| Not logged in                 | `401 Unauthorized` |
| File not found                | `404 Not Found`    |
| Accessing someone else's file | `403 Forbidden`    |

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

### 3. Logout

**Method:** `POST`

**URL:** `http://localhost:3000/user/logout`

On successful logout:
- Response: Logged out
- Token will be removed from cookies
### 4. Upload a File

**Method:** `POST`

**URL:** `http://localhost:3000/files/upload`

**Steps in Postman:**

1. Go to the Body tab
2. Select form-data
3. Add a field:
    - Key: `file`
    - Type: `File`
    - Value: Select any file from local machine

Without errors,
- File is stored in supabase storage
- File's metadata is stored in MongoDB

### 5. Download a File by ID

**Method:** `GET`

**URL:** `http://localhost:3000/files/download/<fileId>`

If authorized:
- A supabase signed url will be generated with time limit of 60 minutes
- The file will be downloaded directly
- Only the Owner of the file can download it.

### 6. Delete a File by ID

**Method:** `DELETE`

**URL:** `http://localhost:3000/files/delete/<fileId>`

If file exists and the user is authorized:
- Response: Deleted
- The file is removed from the supabase storage
- The file's metadata is deleted from MongoDB

### 7. View Files

**Method:** `GET`

**URL:** `http://localhost:3000/files/my-files`

All the files uploaded by the user will be sent in json format.
### Security and Authentication 

This project uses **JWT** based authentication stored in HTTP-only cookies.
##### How Authentication works

1. A registered user logs in using username and password.
2. Backend verifies credentials using bcrypt.
3. Backend generates a JWT token containing:
	- userId
	- email
	- username
4. JWT is stored in an HTTP-only cookie.
5. Protected routes use a middleware to verify the JWT.

#### Token & Cookie Expiry

To prevent tokens from being valid forever, both the JWT and cookie are configured to expire.
1. The token created using JWT expires in 7 days.
2. The cookie is deleted in 7 days.
##### Author
**Aryan Sinha (aryansinha1908)**
