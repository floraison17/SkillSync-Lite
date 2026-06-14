# SkillSync Lite

SkillSync Lite is a web platform that helps students and developers find partners for their study and development projects. Users can create project posts, browse existing projects, apply to join, and manage applications for their own projects.

---

## Technology Stack

- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + ShadCN UI + TanStack Query
- Backend: NestJS + TypeScript + Prisma ORM + REST API
- Database: PostgreSQL
- Authentication: JWT, bcrypt
- DevOps: Docker, Docker Compose
- Version Control: Git + GitHub

---

## Features

### User Authentication
- Register a new account (email, password, name)
- Login and receive a JWT token
- Protected routes (only authenticated users can create/edit/delete projects or apply)

### Projects
- Create a project (title, description, category)
- View all projects (public, no token required)
- View project details
- Edit or delete own projects (only owner)
- Filter projects by category (`?category=Web`)

### Applications
- Apply to any project (except own projects)
- View own applications with status: PENDING, ACCEPTED, REJECTED
- For project owners: view applications for their projects
- Accept or reject applications (owner only)

### UI/UX
- Responsive design (Tailwind CSS)
- Root `/` redirects to `/auth`
- Loading and error states

---

## Quick Start with Docker (recommended)

### Prerequisites
- Docker Desktop installed and running

### Steps

```bash
git clone https://github.com/floraison17/SkillSync-Lite.git
cd SkillSync-Lite
docker-compose up --build
```

After the build finishes, open your browser: http://localhost:3001

Frontend: http://localhost:3001

Backend API: http://localhost:3000

To stop: press Ctrl+C then docker-compose down.

## Manual Setup (without Docker)
### Backend (NestJS)
```bash
cd backend
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run start:dev
```
Backend runs on http://localhost:3000.

### Frontend (Next.js)
``` bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:3000
npm install
npm run dev
```
Frontend runs on http://localhost:3001.

## Project Structure
``` text
SkillSync-Lite/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── applications/
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── auth/page.tsx
│   │   ├── projects/
│   │   ├── applications/
│   │   └── page.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```
## Documentation
Full project documentation (user stories, architecture, ERD, API specification, test cases, deployment) is available in the Google Docs document shared with the professor.

GitHub repository: https://github.com/floraison17/SkillSync-Lite

## License
This project is for educational purposes only, as part of the IT Project / WAP course supervised by Professor Tomasz Rak.
