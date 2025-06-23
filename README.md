💼 Full-Stack Personal Asset Management System
A complete full-stack application for managing personal or organizational IT assets. It combines a modern React + TypeScript frontend with a robust Spring Boot backend, providing secure authentication, intuitive dashboards, and real-time asset tracking.

🧱 Tech Stack
🚀 Frontend
React 18 + TypeScript
Material UI (MUI)
Axios with interceptors
React Router DOM
Day.js for date handling
🛠 Backend
Java 17+
Spring Boot
Spring Security (JWT)
Spring Data JPA + Hibernate
MySQL/PostgreSQL
Swagger (OpenAPI Docs)
🔐 Features
✅ Authentication
Secure login and registration via JWT
Auto token refresh, logout on expiry
Protected routes in frontend
📦 Asset Management
Create, read, update, delete assets
Category and status tracking
Warranty and purchase date pickers
Image upload via URL
📊 Dashboard
Paginated asset tables with filters
Statistics cards and alerts
Expiry status indicators
🌐 API Endpoints
The backend provides RESTful APIs:

Method	Endpoint	Description
POST	/api/auth/login	Authenticate user
POST	/api/auth/register	Register new user
GET	/api/assets	List all assets
POST	/api/assets	Create new asset
PUT	/api/assets/:id	Update asset
DELETE	/api/assets/:id	Delete asset
GET	/api/categories	Get asset categories
GET	/api/statuses	Get asset statuses
🧑‍💻 Getting Started
📂 Backend Setup
Clone and go to backend:
git clone <repo-url>
cd backend
2.Configure DB in src/main/resources/application.properties: spring.datasource.url=jdbc:mysql://localhost:3306/assetdb spring.datasource.username=root spring.datasource.password=yourpassword

3.Run the app: bash ./mvnw spring-boot:run

4.Swagger Docs: bash http://localhost:8080/swagger-ui/index.html

Frontend Setup Go to frontend directory:

bash cd personal-asset-management Install dependencies:

bash npm install Set up environment:

bash

cp .env.example .env

Update REACT_APP_API_BASE_URL to http://localhost:8080/api
Start app:

bash npm start Open in browser: http://localhost:3000
