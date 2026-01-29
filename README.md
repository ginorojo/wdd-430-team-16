# 🛍️ Handcrafted Haven Marketplace

A modern, scalable e-commerce application built with **Next.js 14**, **MongoDB**, and **Prisma ORM**. This project implements a **Feature-Sliced Design** architecture to ensure maintainability and type safety.
## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Database:** MongoDB Atlas (NoSQL)
- **ORM:** [Prisma](https://www.prisma.io/) (Type-safe Database Access)
- **Validation:** [Zod](https://zod.dev/) (Strict runtime validation)
- **Language:** TypeScript

---

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
- Node.js 18+ installed.
- A MongoDB Atlas cluster (Get your connection string ready).

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone  [Repository](https://github.com/ginorojo/wdd-430-team-16)
cd wdd-430-team-16 
npm install
3. Environment Configuration
Create a .env file in the root directory.
Important: You must append the database name (e.g., /artisans) to your connection string.Code snippet
# .env
DATABASE_URL="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/marketplace?retryWrites=true&w=majority&maxPoolSize=10"
4. Database SetupGenerate the Prisma Client and populate the database with initial data.Bash# Generate TypeScript definitions from schema.prisma
npx prisma generate

# Seed the database with dummy products
npx prisma db seed
5. Run Development ServerBashnpm run dev
Open http://localhost:3000 to view the application.📂 Project ArchitectureThis project uses a Feature-Based folder structure to decouple logic.Plaintextsrc/
├── app/                 # Next.js App Router (Routes & Layouts only)
├── features/            # Business Logic by Domain
│   └── products/        # Product Module
│       ├── actions.ts   # Server Actions (Mutations: Create, Delete)
│       ├── queries.ts   # Read Operations (Data Fetching)
│       ├── schemas.ts   # Zod Validation Schemas
│       └── types.ts     # Shared TypeScript Interfaces


## 👥 WDD 430 Team 16

We are a group of 5 students collaborating on this project.

### Team Members:
* **David Steven Balladares Rodriguez** 
* **Cristian Moises De La Hoza Escorcia**
* **Francisco Jose Rodriguez Molina**
* **Gino Alexis Rojo Jorquera**
* **Santiago Benjamin Irigoyen**

---

### Meeting Schedule:
* **Time:** Fridays 02:00 (UTC-0)
