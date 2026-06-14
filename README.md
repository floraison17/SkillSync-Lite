# SkillSync Lite

SkillSync Lite is a web platform for students and developers to find project partners.  
Users can post projects, browse existing ones, apply to join, and accept/reject applications.

## Technology Stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + ShadCN UI + TanStack Query
- **Backend:** NestJS + TypeScript + Prisma ORM + REST API
- **Database:** PostgreSQL
- **Authentication:** JWT
- **DevOps:** Docker, Docker Compose

## Main Features
- User registration and login
- Create, edit, delete own projects
- Browse and filter projects by category
- Apply to join a project
- Accept or reject applications
- View application status

## Quick Start (Docker)
```bash
git clone https://github.com/floraison17/SkillSync-Lite.git
cd SkillSync-Lite
docker-compose up --build
```

Then open http://localhost:3000

## Documentation
Full documentation is available in [Google Docs](https://docs.google.com/document/d/1IPAM_VcfxHhGFJe9nwtjvO-8VliydLWxZ3yoUo4wiAk/edit?usp=sharing).

## Repository Structure
```bash
SkillSync-Lite/
├── backend/       # NestJS application
├── frontend/      # Next.js application
├── docker-compose.yml
└── README.md
```

## License
MIT
