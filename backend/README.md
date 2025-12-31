# WHO OWNS THIS? - Backend

Node.js + Express + MongoDB Atlas backend for the WHO OWNS THIS? application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Configure your MongoDB Atlas connection string in `.env`

4. Start the server:
```bash
npm run dev
```

## Deployment

Deploy to Render or Railway:
1. Set environment variables in your deployment platform
2. Set the start command to `npm start`
3. Ensure PORT is provided by the platform

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /team/create | Create a new team |
| POST | /team/join | Join team (login) |
| GET | /members/:teamId | Get team members |
| GET | /tasks/:teamId | Get team tasks |
| POST | /tasks | Create task (leader only) |
| PATCH | /tasks/:id | Update task status (owner only) |
