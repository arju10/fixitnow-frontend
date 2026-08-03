# 🔗 API Integration Map

> **Synced against the FixItNow Backend Specification.**
> This document maps every frontend route and React component to the specific backend endpoint(s) it consumes.
> Base URL is configured via `NEXT_PUBLIC_API_URL` in `.env.local`.

---

## ⚙️ Global Setup

| Config                | Details                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base URL**          | `NEXT_PUBLIC_API_URL` (configured via `.env.local`)                                                                                                        |
| **Auth Strategy**     | **NextAuth.js** (`/api/auth/[...nextauth]/route.ts`) handles session management. JWT is stored in an HTTP‑only cookie and attached to every Axios request. |
| **Axios Interceptor** | `src/lib/axios.ts` automatically attaches the JWT to every request and normalizes errors into a consistent `{ message, status, details }` shape.           |
| **Toasts**            | `useToast.ts` hook wraps `react-hot-toast` for global success/error notifications.                                                                         |

---

## 🔐 Authentication & Session Management

| Frontend Route / Component                                  | Backend Endpoint                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/auth/register` – `src/app/auth/register/page.tsx`         | `POST /api/auth/register`                                                |
| `/auth/login` – `src/app/auth/login/page.tsx`               | `POST /api/auth/login`                                                   |
| **Session Hydration** – `src/providers/SessionProvider.tsx` | `GET /api/auth/me` (via NextAuth `jwt` / `session` callbacks)            |
| **Auth Hooks** – `src/hooks/useAuth.ts`                     | Wraps NextAuth `useSession` & `signIn`/`signOut` for easier consumption. |

---

## 🏠 Public Browsing (Unauthenticated)

| Frontend Route / Component                                              | Backend Endpoint                                                        |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `/` – `src/app/page.tsx` (Server Component)                             | `GET /api/services` <br> `GET /api/categories`                          |
| `/services` – `src/app/services/page.tsx`                               | `GET /api/services` <br> `GET /api/categories`                          |
| `/services/[id]` – `src/app/services/[id]/page.tsx`                     | `GET /api/services/:id`                                                 |
| `/technicians` – `src/app/technicians/page.tsx`                         | `GET /api/technicians` (Supports `?search=` & `?category=` filters)     |
| `/technicians/[id]` – `src/app/technicians/[id]/page.tsx`               | `GET /api/technicians/:id` (Nested `availability` & `services` assumed) |
| **Search & Filters** – `src/components/SearchFilters.tsx`               | `GET /api/categories` (Populates filter dropdowns)                      |
| **Technician Hooks** – `src/hooks/useTechnicians.ts` & `useServices.ts` | Consumes the above `GET` endpoints with pagination support.             |

---

## 👤 Customer Dashboard (`/dashboard/customer/*`)

| Frontend Route / Component                                                                        | Backend Endpoint                                                     |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `/dashboard/customer` – `src/app/dashboard/customer/page.tsx`                                     | `GET /api/bookings` (Recent list) <br> `GET /api/payments`           |
| `/dashboard/customer/bookings` – `src/app/dashboard/customer/bookings/page.tsx`                   | `GET /api/bookings` (Full history)                                   |
| `/dashboard/customer/bookings/[id]` – `src/app/dashboard/customer/bookings/[id]/page.tsx`         | `GET /api/bookings/:id`                                              |
| `/dashboard/customer/bookings/new` – `src/app/dashboard/customer/bookings/new/page.tsx`           | `POST /api/bookings`                                                 |
| `/dashboard/customer/bookings/[id]/pay` – `src/app/dashboard/customer/bookings/[id]/pay/page.tsx` | `POST /api/payments/create` <br> `GET /api/bookings/:id`             |
| `/dashboard/customer/payments` – `src/app/dashboard/customer/payments/page.tsx`                   | `GET /api/payments`                                                  |
| `/dashboard/customer/reviews/new` – `src/app/dashboard/customer/reviews/new/page.tsx`             | `POST /api/reviews`                                                  |
| `/dashboard/customer/profile` – `src/app/dashboard/customer/profile/page.tsx`                     | `GET /api/customer/profile` <br> `PUT /api/customer/profile`         |
| **Payment Logic** – `src/lib/payment.ts`                                                          | Wraps `POST /api/payments/confirm` & `POST /api/payments/:id/refund` |
| **Customer Hooks** – `src/hooks/useCustomer.ts` & `useBookings.ts`                                | Handles fetching and mutating the above endpoints.                   |

---

## 🔧 Technician Dashboard (`/dashboard/technician/*`)

| Frontend Route / Component                                                                    | Backend Endpoint                                                                                                                                                           |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard/technician` – `src/app/dashboard/technician/page.tsx`                             | `GET /api/bookings` (Overview stats)                                                                                                                                       |
| `/dashboard/technician/bookings` – `src/app/dashboard/technician/bookings/page.tsx`           | `GET /api/bookings` (Manage list)                                                                                                                                          |
| `/dashboard/technician/bookings/[id]` – `src/app/dashboard/technician/bookings/[id]/page.tsx` | `GET /api/bookings/:id` <br> `PATCH /api/bookings/:id/status`                                                                                                              |
| `/dashboard/technician/services` – `src/app/dashboard/technician/services/page.tsx`           | `GET /api/services/my` <br> `POST /api/services` <br> `PUT /api/services/:id` <br> `DELETE /api/services/:id`                                                              |
| `/dashboard/technician/profile` – `src/app/dashboard/technician/profile/page.tsx`             | `GET /api/technicians/profile` <br> `PUT /api/technicians/profile`                                                                                                         |
| `/dashboard/technician/availability` – `src/app/dashboard/technician/availability/page.tsx`   | `GET /api/technicians/availability` <br> `POST /api/technicians/availability` <br> `PUT /api/technicians/availability/:id` <br> `DELETE /api/technicians/availability/:id` |
| **Technician Hooks** – `src/hooks/useTechnicians.ts` & `useBookings.ts`                       | Consumes the above endpoints.                                                                                                                                              |

---

## 🛡️ Admin Dashboard (`/dashboard/admin/*`)

| Frontend Route / Component                                                    | Backend Endpoint                                                                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/dashboard/admin` – `src/app/dashboard/admin/page.tsx`                       | `GET /api/admin/stats`                                                                                             |
| `/dashboard/admin/bookings` – `src/app/dashboard/admin/bookings/page.tsx`     | `GET /api/admin/bookings`                                                                                          |
| `/dashboard/admin/users` – `src/app/dashboard/admin/users/page.tsx`           | `GET /api/admin/users` <br> `PATCH /api/admin/users/:id/status` <br> `DELETE /api/admin/users/:id`                 |
| `/dashboard/admin/categories` – `src/app/dashboard/admin/categories/page.tsx` | `GET /api/categories` <br> `POST /api/categories` <br> `PUT /api/categories/:id` <br> `DELETE /api/categories/:id` |
| `/dashboard/admin/profile` – `src/app/dashboard/admin/profile/page.tsx`       | `GET /api/admin/profile` <br> `PUT /api/admin/profile`                                                             |
| **Admin Hooks** – `src/hooks/useCategories.ts` & `src/lib/admin.ts`           | Handles API calls for admin-level CRUD operations.                                                                 |

---

## 🧩 Data Mappers & Helpers

| Frontend File            | Purpose                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/mappers.ts`     | Converts raw backend API responses (e.g., `booking.status = "PENDING"`) into frontend-friendly UI states (e.g., `BookingStatusBadge.tsx`). |
| `src/lib/validations.ts` | **Zod** schemas (`registerSchema`, `loginSchema`) used by `react-hook-form` to match exact backend validation rules.                       |
| `src/lib/utils.ts`       | Shared utilities (date formatting, currency formatting, class name merging via `clsx`/`tailwind-merge`).                                   |

---

## 🚨 Error Handling Strategy

All Axios calls pass through the interceptor in `src/lib/axios.ts`:

```typescript
// Uniform error shape returned to UI
{
  message: string; // User-friendly error (passed to useToast)
  status: number; // HTTP Status code
  details: any; // Detailed validation error object
}
```

- **Client-side validation:** Caught via react-hook-form + Zod (src/lib/validations.ts).

- **Server-side errors:** Caught in src/hooks/* and displayed via useToast().

## 🔍 Assumptions & Confirmation Checklist

Verify these against your actual backend deployment:

1. POST /api/payments/create – Returns { checkoutUrl, transactionId } (Stripe Redirect). If it returns a Stripe clientSecret instead, update src/app/dashboard/customer/bookings/[id]/pay/page.tsx.

2. POST /api/payments/confirm – Accepts { transactionId } (our internal ID). Verify the success URL is built as: {NEXT_PUBLIC_APP_URL}/dashboard/customer/payments?transactionId={id}.

3. Pagination – GET /api/admin/users and GET /api/technicians return { meta: { totalPages, totalCount } }. Adjust src/hooks/* if your backend uses a different pagination shape.

4. Role Guarding – src/middleware.ts utilizes the role from the session to properly redirect /dashboard/admin, /dashboard/technician, and /dashboard/customer routes.
