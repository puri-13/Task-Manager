# Taskflow

Taskflow is a responsive task manager with a React/Vite dashboard and a Java Spring Boot REST API backed by MySQL. The frontend provides a dashboard, searchable and filterable tasks, a drag-and-drop Kanban board, a list view, dark mode, and task create/edit/delete flows.

## Project structure

```text
taskflow/
├── backend/
│   ├── database.sql
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/taskflow/
│       │   ├── TaskflowApplication.java
│       │   ├── common/                 # API error response and exception handling
│       │   ├── config/                 # CORS configuration
│       │   └── task/                   # Entity, DTOs, repository, service, controller
│       └── resources/application.properties
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── api/                        # Axios API client
│       ├── components/                 # Reusable dashboard and task components
│       ├── pages/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       └── utils.js
└── README.md
```

## Requirements

- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- MySQL 8+

## Run the database

Start MySQL, then create the schema and sample tasks:

```bash
mysql -u root -p < backend/database.sql
```

The backend runs on port `8081` so it does not conflict with services commonly using `8080`. Set the database variables to credentials that work on your MySQL installation; the sample `root` / `password` defaults only work if you configured MySQL that way:

```text
DB_URL=jdbc:mysql://localhost:3306/taskflow?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=your_username
DB_PASSWORD=your_password
SERVER_PORT=8081
```

In PowerShell, set the variables in the same terminal session before starting the API:

```powershell
$env:DB_USERNAME = "your_username"
$env:DB_PASSWORD = "your_password"
$env:SERVER_PORT = "8081"
mvn spring-boot:run
```

## Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8081`. Verify `http://localhost:8081/api/tasks` returns JSON (an empty array is valid) before using the frontend. `spring.jpa.hibernate.ddl-auto=update` keeps the schema aligned during development.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). To point to another API URL, copy `frontend/.env.example` to `frontend/.env` and update `VITE_API_URL`.

## REST endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks, newest first |
| GET | `/api/tasks/{id}` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Replace task fields |
| PATCH | `/api/tasks/{id}/status` | Update task status |
| DELETE | `/api/tasks/{id}` | Delete a task |

Task category values are `WORK`, `PERSONAL`, `STUDY`, `HEALTH`, `OTHER`; priorities are `LOW`, `MEDIUM`, `HIGH`; statuses are `TODO`, `IN_PROGRESS`, `COMPLETED`.
