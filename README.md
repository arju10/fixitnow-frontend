# 🔧 FixItNow - Frontend Application

**FixItNow** is a modern, responsive web application built with **Next.js 16** (App Router) that connects Customers with verified Technicians for service bookings. This frontend provides a seamless, user-friendly interface for registration, authentication, and service management.

---

**Live Link:** [fixitnow-frontend-ruby.vercel.app/](https://fixitnow-frontend-ruby.vercel.app/)

**Frontend Github:** [https://github.com/arju10/fixitnow-frontend.git](https://github.com/arju10/fixitnow-frontend.git)

**Backend Github:** [https://github.com/arju10/fixitnow-backend.git](https://github.com/arju10/fixitnow-backend.git)

**Backend Live:** [https://fixitnow-backend-psi.vercel.app/](https://fixitnow-backend-psi.vercel.app/)

---

## 🚀 Features

- 🔐 **Secure Authentication** – NextAuth.js integration (Login/Register) with JWT and session management.
- 📱 **Fully Responsive** – Built with Tailwind CSS for mobile, tablet, and desktop compatibility.
- ✅ **Form Validation** – React Hook Form + Zod for robust, type-safe client-side validation.
- 🔗 **API Integration** – Centralized Axios client with interceptors and standardized error handling.
- 🛡️ **Role-Based Access** – Dedicated dashboards for Customers, Technicians, and Admins.
- 🚨 **Built-in Error Handling** – Custom `error.tsx`, `global-error.tsx`, and `not-found.tsx` boundaries for graceful UI fallbacks.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State & Forms:** React Hook Form + Zod
- **Auth:** NextAuth.js
- **HTTP Client:** Axios
- **Icons:** Lucide React (implied)
- **Notifications:** React Hot Toast (via `useToast`)

---

## 📁 Project Structure

```bash
fixitnow-frontend/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/auth/[...nextauth]   # NextAuth API route
│   │   ├── auth/                    # Login & Register pages
│   │   ├── dashboard/               # Protected role dashboards
│   │   │   ├── admin/               # Admin dashboard & sub-pages
│   │   │   ├── customer/            # Customer dashboard & sub-pages
│   │   │   └── technician/          # Technician dashboard & sub-pages
│   │   ├── services/                # Public service browsing
│   │   ├── technicians/             # Public technician profiles
│   │   ├── error.tsx                # Root error boundary
│   │   ├── global-error.tsx         # Global error boundary
│   │   ├── loading.tsx              # Root loading skeleton
│   │   ├── not-found.tsx            # Custom 404 page
│   │   ├── globals.css              # Global Tailwind styles
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Homepage
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── admin/                   # Admin-specific components
│   │   ├── auth/                    # Auth-specific components
│   │   ├── bookings/                # Booking UI components
│   │   ├── common/                  # Navbar & Footer
│   │   ├── dashboard/               # Dashboard-specific components
│   │   ├── services/                # Service-related UI
│   │   ├── technicians/             # Technician-related UI
│   │   └── ui/                      # Base components (Button, Input, Skeleton, etc.)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useBookings.ts
│   │   ├── useCategories.ts
│   │   ├── useCustomer.ts
│   │   ├── useSearch.ts
│   │   ├── useServices.ts
│   │   ├── useTechnicians.ts
│   │   └── useToast.ts
│   │
│   ├── lib/                         # Utility functions and API clients
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── axios.ts
│   │   ├── mappers.ts
│   │   ├── payment.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── providers/                   # Context providers
│   │   ├── SessionProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ToastProvider.tsx
│   │
│   ├── types/                       # TypeScript definitions
│   ├── config/                      # App configuration files
│   ├── constants/                   # Global constants
│   ├── context/                     # React Context
│   └── utils/                       # Additional helper functions
│
├── .env.local                       # Environment variables
├── postcss.config.mjs               # PostCSS config
├── tailwind.config.js               # Tailwind CSS config
└── tsconfig.json                    # TypeScript config

```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**

> ⚠️ **Important:** This frontend requires the **FixItNow Backend API** to be running locally or deployed on a server (configured via `NEXT_PUBLIC_API_URL`).

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/arju10/fixitnow-frontend.git
cd fixitnow-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:3000`.

---

## 📦 Available Scripts

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Starts the Next.js development server |
| `npm run build`  | Builds the application for production |
| `npm start`      | Runs the built production server      |
| `npm run lint`   | Runs ESLint to check code quality     |
| `npm run format` | Formats code using Prettier           |

---

## 🛡️ Error Boundaries & 404 Handling

This application includes standard Next.js error boundaries to ensure a graceful user experience:

| File                       | Purpose                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `src/app/error.tsx`        | Catches errors in the root layout and nested routes, showing a fallback UI.                  |
| `src/app/global-error.tsx` | Catches **global** errors that occur outside the root layout (e.g., in `layout.tsx` itself). |
| `src/app/not-found.tsx`    | Custom 404 page displayed when a route is not found (e.g., invalid dashboard ID).            |

---

### ⚡ Loading States (Skeletons)

To ensure a smooth user experience while data is fetching, this app uses built-in Next.js Suspense boundaries:

| File                                       | Purpose                                   |
| ------------------------------------------ | ----------------------------------------- |
| `src/app/loading.tsx`                      | Global skeleton loader for public pages.  |
| `src/app/dashboard/customer/loading.tsx`   | Skeleton loader for Customer dashboard.   |
| `src/app/dashboard/technician/loading.tsx` | Skeleton loader for Technician dashboard. |
| `src/app/dashboard/admin/loading.tsx`      | Skeleton loader for Admin dashboard.      |

---

## 🔗 API Integration Map

### Global Setup

- **Base URL:** `NEXT_PUBLIC_API_URL` (configured in `.env.local`).
- **Axios Instance:** `src/lib/axios.ts` automatically attaches the NextAuth JWT token to every request and normalizes errors via a standardized interceptor.
- **Error Handling:** All API errors are caught in `src/hooks/*` and displayed globally using `src/hooks/useToast.ts`.

### Key Endpoints By Module

<!-- > **Note:** Replace the placeholder endpoints below with your **actual** backend API routes (e.g., `POST /api/auth/register`, `GET /api/services`, etc.). -->

| Frontend Route / Component                             | Backend Endpoint (Placeholder)                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Auth** (`/auth/login`, `/auth/register`)             | `POST /api/auth/login`, `POST /api/auth/register`                                               |
| **Public Browsing** (`/`, `/services`, `/technicians`) | `GET /api/services`, `GET /api/categories`, `GET /api/technicians`                              |
| **Customer Dashboard** (`/dashboard/customer/*`)       | `GET /api/bookings`, `POST /api/bookings`, `GET /api/payments`                                  |
| **Technician Dashboard** (`/dashboard/technician/*`)   | `GET /api/services/my`, `POST /api/availability`, `PATCH /api/bookings/:id/status`              |
| **Admin Dashboard** (`/dashboard/admin/*`)             | `GET /api/admin/users`, `PATCH /api/admin/users/:id/status`, `DELETE /api/admin/categories/:id` |

> For the full list of exact endpoint mappings (including payment confirmations, refunds, and review CRUD), refer to the **Backend API Documentation** or the backend `README.md`.

---

<!--
## 🤝 Contributing

Contributions are always welcome! If you'd like to improve this frontend:

1. Fork the project.
2. Create a new feature branch (`git checkout -b feature/awesome-ui`).
3. Commit your changes (`git commit -m 'Add some awesome UI updates'`).
4. Push to the branch (`git push origin feature/awesome-ui`).
5. Open a Pull Request. -->

<!-- ---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

--- -->

## 📬 Contact

**Arju**  
🔗 GitHub: [@arju10](https://github.com/arju10)  
📧 Email: [mst.tahminajerinarju@gmail.com](mailto:mst.tahminajerinarju@gmail.com) _(replace with your actual email)_

---

> ⭐ **If you like this project, don't forget to give it a star on GitHub!**
